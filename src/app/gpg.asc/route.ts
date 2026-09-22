import { GPG_PUBLIC_KEY } from "@/lib/gpg";

export function GET() {
  if (!GPG_PUBLIC_KEY) {
    return new Response("GPG public key has not been published yet.\n", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  return new Response(GPG_PUBLIC_KEY.endsWith("\n") ? GPG_PUBLIC_KEY : `${GPG_PUBLIC_KEY}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
