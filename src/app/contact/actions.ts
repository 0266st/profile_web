"use server";

import { headers } from "next/headers";
import { Resend } from "resend";
import { validateAll, type ContactValues, type FieldErrors } from "@/lib/contact-schema";

export type ContactState =
  | { status: "idle" }
  | { status: "success" }
  | { status: "error"; message: string; fieldErrors?: FieldErrors; at: number };

function fail(message: string, fieldErrors?: FieldErrors): ContactState {
  return { status: "error", message, fieldErrors, at: Date.now() };
}

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

function readValues(formData: FormData): ContactValues {
  const get = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };
  return {
    category: get("category"),
    name: get("name").trim(),
    email: get("email").trim(),
    message: get("message").trim(),
  };
}

const TURNSTILE_ACTION = "contact";

// Frontend hostnames this deployment accepts tokens from (comma-separated).
// Never include localhost in production.
function expectedHostnames() {
  return new Set(
    (process.env.TURNSTILE_HOSTNAMES ?? "")
      .split(",")
      .map((hostname) => hostname.trim())
      .filter(Boolean)
  );
}

type SiteverifyResult = {
  success: boolean;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
  metadata?: { result_with_testing_key?: boolean };
};

async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("[contact] TURNSTILE_SECRET_KEY is not set");
    return false;
  }
  const hostnames = expectedHostnames();
  const isDev = process.env.NODE_ENV !== "production";
  if (hostnames.size === 0 && !isDev) {
    console.error("[contact] TURNSTILE_HOSTNAMES is not set");
    return false;
  }
  if (token.length > 2048) return false;

  const h = await headers();
  const remoteip = h.get("cf-connecting-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim();

  const body = new URLSearchParams({ secret, response: token });
  if (remoteip) body.set("remoteip", remoteip);

  const res = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    body,
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) return false;
  const data: SiteverifyResult = await res.json();
  if (!data.success) {
    console.warn("[contact] turnstile rejected:", data["error-codes"]);
    return false;
  }
  // Cloudflare's test keys answer with hostname "example.com" and no action.
  if (isDev && data.metadata?.result_with_testing_key) return true;
  if (data.action !== TURNSTILE_ACTION || !data.hostname || !hostnames.has(data.hostname)) {
    console.warn("[contact] turnstile mismatch:", { action: data.action, hostname: data.hostname });
    return false;
  }
  return true;
}

function formatSubmittedAt(date: Date) {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

async function sendMail(values: ContactValues): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM;
  const to = process.env.CONTACT_TO ?? "main@ztssst.dev";
  if (!apiKey || !from) {
    console.error("[contact] RESEND_API_KEY / CONTACT_FROM is not set; message not sent");
    return false;
  }

  const text = [
    `種別: ${values.category}`,
    `お名前: ${values.name || "(未記入)"}`,
    `メールアドレス: ${values.email}`,
    `送信日時: ${formatSubmittedAt(new Date())} JST`,
    "",
    values.message,
  ].join("\n");

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: values.email,
    subject: `[問い合わせフォーム] ${values.category}`,
    text,
  });
  if (error) {
    console.error("[contact] resend failed:", error.name, error.message);
    return false;
  }
  return true;
}

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const values = readValues(formData);
  const fieldErrors = validateAll(values);
  if (Object.keys(fieldErrors).length > 0) {
    return fail("入力内容に不備があります。赤く表示された項目を直してください。", fieldErrors);
  }

  const token = formData.get("cf-turnstile-response");
  if (typeof token !== "string" || !token) {
    return fail("ロボット判定が完了していません。判定の完了を待ってから送信してください。");
  }

  try {
    if (!(await verifyTurnstile(token))) {
      return fail("ロボット判定に失敗しました。判定をやり直してから、もう一度送信してください。");
    }
    if (!(await sendMail(values))) {
      return fail("送信できませんでした。時間をおいて再度お試しいただくか、main@ztssst.dev へ直接メールしてください。");
    }
  } catch (error) {
    console.error("[contact] unexpected error:", error);
    return fail("送信中に通信エラーが起きました。時間をおいて再度お試しいただくか、main@ztssst.dev へ直接メールしてください。");
  }

  return { status: "success" };
}
