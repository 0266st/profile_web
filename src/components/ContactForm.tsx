"use client";

import Script from "next/script";
import { useActionState, useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { sendContact, type ContactState } from "@/app/contact/actions";
import {
  CONTACT_CATEGORIES,
  LIMITS,
  validateAll,
  validateField,
  type ContactField,
  type ContactValues,
} from "@/lib/contact-schema";

type TurnstileOptions = {
  sitekey: string;
  action?: string;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "flexible" | "compact";
  language?: string;
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
};

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, options: TurnstileOptions) => string;
      remove: (widgetId: string) => void;
    };
  }
}

const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

function Turnstile({ siteKey, onToken }: { siteKey: string; onToken: (token: string | null) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  const renderWidget = useCallback(() => {
    const el = containerRef.current;
    if (!el || !window.turnstile || widgetIdRef.current) return;
    widgetIdRef.current = window.turnstile.render(el, {
      sitekey: siteKey,
      // Checked server-side against siteverify's `action` (contact/actions.ts).
      action: "contact",
      theme: document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light",
      // The normal widget is 300px wide; fall back to compact on narrow screens.
      size: el.clientWidth < 300 ? "compact" : "flexible",
      language: "ja",
      callback: (token) => onToken(token),
      "expired-callback": () => onToken(null),
      "error-callback": () => onToken(null),
    });
  }, [siteKey, onToken]);

  useEffect(() => {
    renderWidget();
    return () => {
      if (widgetIdRef.current) window.turnstile?.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    };
  }, [renderWidget]);

  return (
    <>
      <Script src={TURNSTILE_SRC} strategy="afterInteractive" onReady={renderWidget} />
      <div ref={containerRef} className="contact__captcha" />
    </>
  );
}

const EMPTY: ContactValues = { category: "", name: "", email: "", message: "" };
const INITIAL_STATE: ContactState = { status: "idle" };

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(sendContact, INITIAL_STATE);
  const [values, setValues] = useState<ContactValues>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const formRef = useRef<HTMLFormElement>(null);

  // A Turnstile token is single-use, so every server response gets a fresh widget.
  const widgetKey = state.status === "error" ? state.at : 0;
  const [tokenState, setTokenState] = useState<{ key: number; value: string | null }>({ key: 0, value: null });
  const token = tokenState.key === widgetKey ? tokenState.value : null;
  const handleToken = useCallback(
    (value: string | null) => setTokenState({ key: widgetKey, value }),
    [widgetKey]
  );

  function fieldError(field: ContactField) {
    if (touched[field]) return validateField(field, values);
    return state.status === "error" ? state.fieldErrors?.[field] : undefined;
  }

  function update(field: ContactField, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  function markTouched(field: ContactField) {
    setTouched((t) => ({ ...t, [field]: true }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const errors = validateAll(values);
    if (Object.keys(errors).length === 0) return;
    e.preventDefault();
    setTouched({ category: true, name: true, email: true, message: true });
    const first = (["category", "name", "email", "message"] as const).find((f) => errors[f]);
    formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
  }

  if (state.status === "success") {
    return (
      <div className="contact__done" role="status">
        <p className="contact__done-title">送信しました。</p>
        <p className="muted">内容を確認のうえ、入力いただいたメールアドレス宛に返信します。</p>
      </div>
    );
  }

  const categoryError = fieldError("category");
  const emailError = fieldError("email");
  const messageError = fieldError("message");
  const nameError = fieldError("name");

  return (
    <form ref={formRef} className="contact" action={formAction} onSubmit={handleSubmit} noValidate>
      <fieldset
        className="field"
        aria-describedby="category-help"
        aria-invalid={categoryError ? true : undefined}
      >
        <legend className="field__label">
          種別 <span className="field__req">必須</span>
        </legend>
        <div className="chips" role="radiogroup" aria-required="true">
          {CONTACT_CATEGORIES.map((category, i) => (
            <label key={category} className="chip">
              <input
                type="radio"
                name="category"
                value={category}
                checked={values.category === category}
                onChange={(e) => {
                  update("category", e.target.value);
                  markTouched("category");
                }}
                data-field={i === 0 ? "category" : undefined}
              />
              <span>{category}</span>
            </label>
          ))}
        </div>
        <p id="category-help" className={`field__help${categoryError ? " is-error" : ""}`}>
          {categoryError}
        </p>
      </fieldset>

      <div className="field">
        <label className="field__label" htmlFor="contact-name">
          お名前 <span className="field__opt">任意</span>
        </label>
        <input
          id="contact-name"
          className="input"
          name="name"
          autoComplete="name"
          maxLength={LIMITS.name}
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          onBlur={() => markTouched("name")}
          aria-invalid={nameError ? true : undefined}
          aria-describedby="name-help"
          data-field="name"
        />
        <p id="name-help" className={`field__help${nameError ? " is-error" : ""}`}>
          {nameError}
        </p>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="contact-email">
          メールアドレス <span className="field__req">必須</span>
        </label>
        <input
          id="contact-email"
          className="input"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="name@example.com"
          maxLength={LIMITS.email}
          required
          aria-required="true"
          value={values.email}
          onChange={(e) => update("email", e.target.value)}
          onBlur={() => markTouched("email")}
          aria-invalid={emailError ? true : undefined}
          aria-describedby="email-help"
          data-field="email"
        />
        <p id="email-help" className={`field__help${emailError ? " is-error" : ""}`}>
          {emailError}
        </p>
      </div>

      <div className="field">
        <label className="field__label" htmlFor="contact-message">
          問い合わせ内容 <span className="field__req">必須</span>
        </label>
        <textarea
          id="contact-message"
          className="input input--area"
          name="message"
          rows={8}
          maxLength={LIMITS.message}
          required
          aria-required="true"
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          onBlur={() => markTouched("message")}
          aria-invalid={messageError ? true : undefined}
          aria-describedby="message-help"
          data-field="message"
        />
        <p id="message-help" className={`field__help${messageError ? " is-error" : ""}`}>
          {messageError ?? `${values.message.length} / ${LIMITS.message}`}
        </p>
      </div>

      {SITE_KEY ? (
        <Turnstile key={widgetKey} siteKey={SITE_KEY} onToken={handleToken} />
      ) : (
        <p className="field__help is-error">CAPTCHAが設定されていないため、現在は送信できません。</p>
      )}

      {state.status === "error" && (
        <p className="contact__error" role="alert">
          {state.message}
        </p>
      )}

      <div className="contact__actions">
        <button type="submit" className="btn btn--primary btn--submit" disabled={pending || !token}>
          {pending ? "送信中…" : "送信する"}
        </button>
        {!token && !pending && SITE_KEY && <span className="muted contact__wait">ロボット判定の完了を待っています…</span>}
      </div>
    </form>
  );
}
