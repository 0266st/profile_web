"use server";

import { cookies } from "next/headers";
import { SPOT_COOKIE, SPOT_PATH, SPOT_TOLERANCE, SPOT_X, SPOT_Y } from "./spot.server";

export async function probe(x: number, y: number): Promise<string | null> {
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  if (Math.abs(x - SPOT_X) > SPOT_TOLERANCE || Math.abs(y - SPOT_Y) > SPOT_TOLERANCE) return null;

  (await cookies()).set(SPOT_COOKIE.name, SPOT_COOKIE.value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: SPOT_PATH,
    maxAge: 600,
  });
  return SPOT_PATH;
}
