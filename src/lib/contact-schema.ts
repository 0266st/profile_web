export const CONTACT_CATEGORIES = ["有償依頼", "無償依頼", "問い合わせ", "その他"] as const;
export type ContactCategory = (typeof CONTACT_CATEGORIES)[number];

export const LIMITS = { name: 100, email: 254, message: 5000 } as const;

export type ContactValues = {
  category: string;
  name: string;
  email: string;
  message: string;
};

export type ContactField = "category" | "email" | "message" | "name";
export type FieldErrors = Partial<Record<ContactField, string>>;

// Deliberately loose: the address is only used as Reply-To, so the job here is
// to catch typos and header-injection characters, not to be RFC-complete.
const EMAIL_RE = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[^\s@<>()",;:]+$/;

export function validateField(field: ContactField, values: ContactValues): string | undefined {
  switch (field) {
    case "category":
      return (CONTACT_CATEGORIES as readonly string[]).includes(values.category)
        ? undefined
        : "種別が選ばれていません。4つのうちどれかを選んでください。";
    case "name":
      return values.name.length > LIMITS.name
        ? `お名前が長すぎます。${LIMITS.name}文字以内にしてください。`
        : undefined;
    case "email": {
      const email = values.email.trim();
      if (!email) return "メールアドレスが空です。返信先のアドレスを入力してください。";
      if (email.length > LIMITS.email || !EMAIL_RE.test(email)) {
        return "メールアドレスの形式が正しくありません。name@example.com の形で入力してください。";
      }
      return undefined;
    }
    case "message": {
      const message = values.message.trim();
      if (!message) return "問い合わせ内容が空です。用件を入力してください。";
      if (message.length > LIMITS.message) {
        return `問い合わせ内容が長すぎます。${LIMITS.message}文字以内にしてください。`;
      }
      return undefined;
    }
  }
}

export function validateAll(values: ContactValues): FieldErrors {
  const errors: FieldErrors = {};
  for (const field of ["category", "name", "email", "message"] as const) {
    const error = validateField(field, values);
    if (error) errors[field] = error;
  }
  return errors;
}
