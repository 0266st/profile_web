import { SKILLS } from "@/lib/skills";

const SHORTCUTS: [string, string][] = [
  ["^G", "Help"],
  ["^O", "Write Out"],
  ["^F", "Where Is"],
  ["^K", "Cut"],
  ["^T", "Execute"],
  ["^C", "Location"],
  ["^X", "Exit"],
  ["^R", "Read File"],
  ["^\\", "Replace"],
  ["^U", "Paste"],
  ["^J", "Justify"],
  ["^/", "Go To Line"],
];

// skills.md as a Markdown table, column-aligned the way it'd sit in a file.
function markdownLines() {
  const header = ["Language", "Used in"];
  const rows = SKILLS.map((s) => [s.name, s.usedIn]);
  const widths = header.map((h, i) => Math.max(h.length, ...rows.map((r) => r[i].length)));
  const row = (cells: string[]) => `| ${cells.map((c, i) => c.padEnd(widths[i])).join(" | ")} |`;
  return ["# Skills", "", row(header), `| ${widths.map((w) => "-".repeat(w)).join(" | ")} |`, ...rows.map(row)];
}

export default function SkillsBand() {
  const lines = markdownLines();

  return (
    <section id="skills" className="skills" aria-labelledby="skills-heading">
      <div className="container">
        <h2 id="skills-heading" className="section-title">
          Skills
        </h2>
        <div className="sr-only">
          <table>
            <caption>保有スキルと、確認できる利用例</caption>
            <thead>
              <tr>
                <th scope="col">Language</th>
                <th scope="col">Used in</th>
              </tr>
            </thead>
            <tbody>
              {SKILLS.map((skill) => (
                <tr key={skill.name}>
                  <th scope="row">{skill.name}</th>
                  <td>{skill.usedIn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="nano" aria-hidden="true">
          <div className="nano__title">
            <span>0266st Skill Check</span>
            <span className="nano__file">skills.md</span>
            <span />
          </div>
          <div className="nano__body">
            {lines.map((line, i) => (
              <div key={i} className="nano__line">
                <span className="nano__ln">{i + 1}</span>
                <span className={line.startsWith("#") ? "nano__md-head" : undefined}>{line || " "}</span>
              </div>
            ))}
          </div>
          <div className="nano__status">
            <span>[ Read {lines.length} lines ]</span>
          </div>
          <div className="nano__keys">
            {SHORTCUTS.map(([key, label]) => (
              <span key={key} className="nano__key">
                <kbd>{key}</kbd> {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
