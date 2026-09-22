import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Prompt from "@/components/Prompt";
import Reward from "@/components/Reward";
import { SPOT_COOKIE, SPOT_PATH } from "@/lib/spot.server";

type Props = { params: Promise<{ slug: string }> };

async function isOpen({ params }: Props) {
  const { slug } = await params;
  if (`/${slug}` !== SPOT_PATH) return false;
  return (await cookies()).get(SPOT_COOKIE.name)?.value === SPOT_COOKIE.value;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  if (!(await isOpen(props))) return {};
  return { title: "(266, 168)", robots: { index: false, follow: false } };
}

const HANDLE = "@0168th";
const LINES = [
  "よくここまでたどりついたね。",
  "",
  "うーん、なぜかって？",
  "押した場所が(266,168)のピクセルだったからだよ。",
  `こっそり、Twitter(${HANDLE})のDMに教えて！`,
];
// What vi would report for this file (UTF-8, trailing newline).
const BYTES = new TextEncoder().encode(LINES.join("\n") + "\n").length;

export default async function Page(props: Props) {
  if (!(await isOpen(props))) notFound();

  return (
    <main className="memo">
      <div className="container">
        <div className="code-card memo__card">
          <div className="code-card__bar">
            <span className="code-card__filename">(266, 168)</span>
          </div>
          <div className="code-card__body">
            <Prompt command="vi ~/.secret" typed />
            <div className="vi">
              <div className="vi__buffer">
                {LINES.map((line, i) => (
                  <div key={i} className="vi__line">
                    {i === 0 ? (
                      <>
                        <span className="vi__cursor">{line[0]}</span>
                        {line.slice(1)}
                      </>
                    ) : line.includes(HANDLE) ? (
                      <>
                        {line.slice(0, line.indexOf(HANDLE))}
                        <a
                          className="memo__link"
                          href="https://x.com/0168th"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="@0168th(新しいタブで開く)"
                        >
                          {HANDLE}
                        </a>
                        {line.slice(line.indexOf(HANDLE) + HANDLE.length)}
                      </>
                    ) : (
                      line || " "
                    )}
                  </div>
                ))}
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={`t${i}`} className="vi__line vi__tilde" aria-hidden="true">
                    ~
                  </div>
                ))}
              </div>
              <div className="vi__status" aria-hidden="true">
                <span>
                  &quot;~/.secret&quot; [readonly] {LINES.length}L, {BYTES}B
                </span>
                <span>1,1{"  "}All</span>
              </div>
            </div>
            <Reward />
          </div>
        </div>
        <Link className="memo__back" href="/">
          ← トップへ戻る
        </Link>
      </div>
    </main>
  );
}
