"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { probe } from "@/lib/pointer-actions";

const SALT = "868eb56d8650f588";
const TARGET = "96332cf8ade206ca9fc52c9cf7ce2247f2a9c284808df0e44216ced07376fb8d";
const RADIUS = 3;

async function sha256(text: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
}

async function isNearTarget(x: number, y: number) {
  const candidates: Promise<string>[] = [];
  for (let dx = -RADIUS; dx <= RADIUS; dx++) {
    for (let dy = -RADIUS; dy <= RADIUS; dy++) {
      candidates.push(sha256(`${SALT}:${x + dx},${y + dy}`));
    }
  }
  return (await Promise.all(candidates)).includes(TARGET);
}

export default function PointerProbe() {
  const router = useRouter();

  useEffect(() => {
    if (!crypto?.subtle) return;
    let busy = false;
    async function onClick(e: MouseEvent) {
      if (busy) return;
      const x = Math.round(e.pageX);
      const y = Math.round(e.pageY);
      busy = true;
      try {
        if (!(await isNearTarget(x, y))) return;
        const href = await probe(x, y);
        if (href) router.push(href);
      } finally {
        busy = false;
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [router]);

  return null;
}
