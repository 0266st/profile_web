import { SSH_PUBLIC_KEY } from "@/lib/keys";

export function GET() {
  if (!SSH_PUBLIC_KEY) {
    return new Response("SSH public key has not been published yet.\n", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  return new Response(`${SSH_PUBLIC_KEY}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
