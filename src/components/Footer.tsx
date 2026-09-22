import { GPG_FINGERPRINT, GPG_PUBLIC_KEY } from "@/lib/gpg";
import { ROLES } from "@/lib/profile";
import { AGE_PUBLIC_KEY, SSH_PUBLIC_KEY } from "@/lib/keys";
import { sshFingerprintArt } from "@/lib/ssh-randomart";
import Link from "next/link";
import { FormIcon, GitHubIcon, MailIcon, XIcon } from "./icons";

export default function Footer() {
  const year = new Date().getFullYear();
  const ssh = SSH_PUBLIC_KEY ? sshFingerprintArt(SSH_PUBLIC_KEY) : null;

  return (
    <footer id="contact" className="foot-mast">
      <div className="container">
        <p className="wordmark">0266st / 0168th</p>
        <p className="foot-mast__tagline">{ROLES.join(" · ")}</p>
        <div className="foot-mast__links">
          <a
            href="https://github.com/0266st"
            target="_blank"
            rel="noopener noreferrer"
          >
            <GitHubIcon className="foot-mast__icon" />
            <span className="foot-mast__label">GitHub</span>
            <span aria-hidden="true">↗</span>
            <span className="sr-only">(新しいタブで開く)</span>
          </a>
          <a
            href="https://x.com/0168th"
            target="_blank"
            rel="noopener noreferrer"
          >
            <XIcon className="foot-mast__icon" size={14} />
            <span className="foot-mast__label">X</span>
            <span aria-hidden="true">↗</span>
            <span className="sr-only">(新しいタブで開く)</span>
          </a>
          <a href="mailto:main@ztssst.dev">
            <MailIcon className="foot-mast__icon" />
            <span className="foot-mast__label">main@ztssst.dev</span>
          </a>
          <Link href="/contact">
            <FormIcon className="foot-mast__icon" />
            <span className="foot-mast__label">問い合わせフォーム</span>
          </Link>
        </div>
        <div className="foot-mast__keys">
          <section className="foot-mast__key" aria-labelledby="gpg-heading">
            <h2 id="gpg-heading" className="foot-mast__key-head">
              GPG
            </h2>
            {GPG_PUBLIC_KEY && GPG_FINGERPRINT ? (
              <>
                <p className="foot-mast__key-fpr">
                  <code>{GPG_FINGERPRINT}</code>
                  <a href="/gpg.asc">/gpg.asc</a>
                </p>
                <details className="foot-mast__key-body">
                  <summary>公開鍵を表示</summary>
                  <pre>{GPG_PUBLIC_KEY}</pre>
                </details>
              </>
            ) : (
              <p className="foot-mast__key-fpr muted">公開鍵は準備中です。</p>
            )}
          </section>
          <section className="foot-mast__key" aria-labelledby="ssh-heading">
            <h2 id="ssh-heading" className="foot-mast__key-head">
              SSH
            </h2>
            {ssh ? (
              <>
                <pre
                  className="randomart"
                  role="img"
                  aria-label={`SSH鍵 (${ssh.type} ${ssh.bits}) のrandomart`}
                >
                  {ssh.art}
                </pre>
                <p className="foot-mast__key-fpr">
                  <code>{ssh.fingerprint}</code>
                  <a href="/ssh.pub">/ssh.pub</a>
                </p>
              </>
            ) : (
              <p className="foot-mast__key-fpr muted">公開鍵は準備中です。</p>
            )}
          </section>
          <section className="foot-mast__key" aria-labelledby="age-heading">
            <h2 id="age-heading" className="foot-mast__key-head">
              age
            </h2>
            {AGE_PUBLIC_KEY ? (
              <p className="foot-mast__key-fpr">
                <code className="age-key">{AGE_PUBLIC_KEY}</code>
              </p>
            ) : (
              <p className="foot-mast__key-fpr muted">公開鍵は準備中です。</p>
            )}
          </section>
        </div>
        <p className="foot-mast__copyright">© {year} 0266st / 0168th</p>
      </div>
    </footer>
  );
}
