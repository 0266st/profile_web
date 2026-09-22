import { parseMediaUrl, works, type MediaSource, type Work } from "@/lib/works";
import Gear from "./Gear";
import Prompt from "./Prompt";
import YouTubeFacade from "./YouTubeFacade";

const PLATFORM_LABEL = { youtube: "YouTube", spotify: "Spotify" } as const;

function Media({ source, title }: { source: MediaSource; title: string }) {
  if (source.kind === "youtube") {
    return (
      <div className="media media--video">
        <YouTubeFacade id={source.id} title={title} />
      </div>
    );
  }
  const compact = source.type === "track" || source.type === "episode";
  return (
    <div className="media">
      <iframe
        className="media__spotify"
        src={`https://open.spotify.com/embed/${source.type}/${source.id}?utm_source=generator`}
        title={title}
        height={compact ? 152 : 352}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      />
    </div>
  );
}

function WorkCard({ work }: { work: Work }) {
  const source = parseMediaUrl(work.url);
  return (
    <article className="work">
      {source && <Media source={source} title={work.title} />}
      <div className="work__meta">
        <h3 className="work__title">{work.title}</h3>
        <p className="work__sub">
          {source && <span>{PLATFORM_LABEL[source.kind]}</span>}
          {work.date && (
            <time dateTime={work.date}>{work.date.replace(/-/g, "/")}</time>
          )}
          <a href={work.url} target="_blank" rel="noopener noreferrer">
            開く<span aria-hidden="true"> ↗</span>
            <span className="sr-only">(新しいタブで開く)</span>
          </a>
        </p>
      </div>
    </article>
  );
}

export default function MusicSection() {
  return (
    <section id="music" className="works">
      <div className="container">
        <h2 className="section-title">Music</h2>
        <Gear />
        <section
          id="works"
          className="subsection"
          aria-labelledby="works-heading"
        >
          <h3 id="works-heading" className="subsection-title">
            Works
          </h3>
          {works.length === 0 ? (
            <div className="works__empty">
              <Prompt command="ls -a ~/works" />
              <p className="term-out">
                <span className="term-out__dir">.</span>
                {"  "}
                <span className="term-out__dir">..</span>
                {"  "}.cookin
              </p>
              <Prompt command="cat ~/works/.cookin" />
              <p className="term-out">
                Still cookin&apos; in the DAW... nothing&apos;s dropped here yet
                :)
              </p>
            </div>
          ) : (
            <ul className="works__grid">
              {works.map((work) => (
                <li key={work.url}>
                  <WorkCard work={work} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </section>
  );
}
