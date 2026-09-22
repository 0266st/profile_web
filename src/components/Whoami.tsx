import { getWhoamiLang } from "@/lib/lang";
import Prompt from "./Prompt";

const WHOAMI = {
  ja: "poor programmer. \n資産0円でPCがFIRE(アッツアツ)。追加投資せず現在0万円｜元保育園生→小学生→中学生→高専生｜グラボ、メモリ投資1年｜ざこざこプログラマー。逆張り系。Android/Linuxを使用",
  en: "Bank account: $0. PC: FIRE'd (literally, it's on fire, thermal throttling go brrr) \u{1F480}\nNet worth: still $0, no cap, zero additional investment, we broke fr\nEx-daycare kid → elementary school dropout arc → junior high schooler → now a kosen student grindin'\nGPU + RAM investments: 1 year deep, portfolio still mid\nProgrammer status: absolute NPC tier, straight up mid-diff, skill issue certified\nVibe: certified contrarian, if everyone zigs I zag (into a wall)\nOS: Android/Linux geek, no cap, touch grass? never heard of her",
} as const;

export default async function Whoami() {
  const lang = await getWhoamiLang();

  return (
    <div className="code-card">
      <div className="code-card__bar">
        <span className="code-card__filename">whoami.sh</span>
      </div>
      <div className="code-card__body">
        <Prompt command="whoami" typed />
        <p className="code-card__output">{WHOAMI[lang]}</p>
      </div>
    </div>
  );
}
