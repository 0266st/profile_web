import { GEAR } from "@/lib/gear";

const MENU = ["File", "Edit", "View", "Help"];

export default function Gear() {
  return (
    <section id="gear" className="subsection" aria-labelledby="gear-heading">
      <h3 id="gear-heading" className="subsection-title">
        Gear
      </h3>
      <dl className="sr-only">
        {GEAR.map(([key, value]) => (
          <div key={key}>
            <dt>{key}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>

      {/* Microsoft Edit, with gear.txt open. */}
      <div className="msedit" aria-hidden="true">
        <div className="msedit__menu">
          {MENU.map((item) => (
            <span key={item}>
              <u>{item[0]}</u>
              {item.slice(1)}
            </span>
          ))}
        </div>
        <div className="msedit__body">
          {GEAR.map(([key, value], i) => (
            <div
              key={key}
              className={`msedit__line${i === 0 ? " is-current" : ""}`}
            >
              <span className="msedit__ln">{i + 1}</span>
              <span className="msedit__text">
                {key}: {value}
              </span>
            </div>
          ))}
          <div className="msedit__line msedit__line--rest">
            <span className="msedit__ln" />
          </div>
        </div>
        <div className="msedit__status">
          <span>[LF]</span>
          <span>[UTF-8]</span>
          <span>[Spaces:4]</span>
          <span>1:1</span>
          <span className="msedit__file">[gear.txt]</span>
        </div>
      </div>
    </section>
  );
}
