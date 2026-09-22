import { createHash } from "node:crypto";

// Port of OpenSSH's fingerprint_randomart() ("drunken bishop", sshkey.c) so the
// art always matches `ssh-keygen -lv` for whatever key is configured.
const FIELD_W = 17;
const FIELD_H = 9;
const SYMBOLS = " .o+=*BOX@%&#/^SE";

type KeyInfo = { type: string; bits: number; blob: Buffer };

function readString(buf: Buffer, offset: number): [Buffer, number] {
  const len = buf.readUInt32BE(offset);
  return [buf.subarray(offset + 4, offset + 4 + len), offset + 4 + len];
}

function parsePublicKey(line: string): KeyInfo {
  const [, b64] = line.trim().split(/\s+/);
  const blob = Buffer.from(b64, "base64");
  const [typeBuf, afterType] = readString(blob, 0);
  const type = typeBuf.toString();
  if (type === "ssh-rsa") {
    const [, afterE] = readString(blob, afterType); // public exponent
    const [n] = readString(blob, afterE); // modulus (mpint, may have a leading 0x00)
    const modulus = n[0] === 0 ? n.subarray(1) : n;
    const bits = (modulus.length - 1) * 8 + (32 - Math.clz32(modulus[0]));
    return { type: "RSA", bits, blob };
  }
  if (type === "ssh-ed25519") return { type: "ED25519", bits: 256, blob };
  const ecdsa = /^ecdsa-sha2-nistp(\d+)$/.exec(type);
  if (ecdsa) return { type: "ECDSA", bits: Number(ecdsa[1]), blob };
  throw new Error(`unsupported SSH key type: ${type}`);
}

function centered(label: string) {
  const left = Math.floor((FIELD_W - label.length) / 2);
  return `+${"-".repeat(left)}${label}${"-".repeat(FIELD_W - left - label.length)}+`;
}

export function sshFingerprintArt(publicKeyLine: string) {
  const key = parsePublicKey(publicKeyLine);
  const digest = createHash("sha256").update(key.blob).digest();

  const field = Array.from({ length: FIELD_W }, () => new Array<number>(FIELD_H).fill(0));
  const max = SYMBOLS.length - 1;
  let x = Math.floor(FIELD_W / 2);
  let y = Math.floor(FIELD_H / 2);
  for (const byte of digest) {
    let input = byte;
    for (let step = 0; step < 4; step++) {
      x = Math.min(Math.max(x + (input & 1 ? 1 : -1), 0), FIELD_W - 1);
      y = Math.min(Math.max(y + (input & 2 ? 1 : -1), 0), FIELD_H - 1);
      if (field[x][y] < max - 2) field[x][y]++;
      input >>= 2;
    }
  }
  field[Math.floor(FIELD_W / 2)][Math.floor(FIELD_H / 2)] = max - 1; // S
  field[x][y] = max; // E

  const rows = Array.from({ length: FIELD_H }, (_, row) => `|${field.map((col) => SYMBOLS[col[row]]).join("")}|`);
  const art = [centered(`[${key.type} ${key.bits}]`), ...rows, centered("[SHA256]")].join("\n");
  const fingerprint = `SHA256:${digest.toString("base64").replace(/=+$/, "")}`;
  return { art, fingerprint, type: key.type, bits: key.bits };
}
