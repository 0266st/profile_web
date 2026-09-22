import { headers } from "next/headers";

export type Lang = "ja" | "en";

/**
 * Only the whoami block switches language, based on the request's
 * Accept-Language header — everything else on the site stays Japanese.
 */
export async function getWhoamiLang(): Promise<Lang> {
  const headerList = await headers();
  const acceptLanguage = headerList.get("accept-language") ?? "";
  const primary = acceptLanguage.split(",")[0]?.trim().split(";")[0]?.toLowerCase() ?? "";
  return primary.startsWith("ja") ? "ja" : "en";
}
