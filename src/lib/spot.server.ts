import "server-only";
import { createHash } from "node:crypto";
import { AVATARS, ROLES } from "./profile";

const digest = (...parts: string[]) => createHash("sha256").update(parts.join("\0")).digest("hex");

export const [SPOT_X, SPOT_Y] = AVATARS.map(({ handle }) => parseInt(handle, 10));
export const SPOT_TOLERANCE = 3;
export const SPOT_PATH = `/${digest(...ROLES).slice(0, 11)}`;
export const SPOT_COOKIE = {
  name: "_s",
  value: digest(SPOT_PATH, ...AVATARS.map(({ handle }) => handle)).slice(0, 32),
} as const;
