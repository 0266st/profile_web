import Image from "next/image";
import type { ReactNode } from "react";
import type { Project } from "@/lib/projects";
import { formatDateTimeJst, formatRelativeJa, getRepoStats } from "@/lib/github";

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="btn btn--outline" href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="btn__ext" aria-hidden="true">
        ↗
      </span>
      <span className="sr-only">(新しいタブで開く)</span>
    </a>
  );
}

export default async function ProjectBlock({
  project,
  reverse,
}: {
  project: Project;
  reverse: boolean;
}) {
  const stats = await getRepoStats(project.repo);

  return (
    <div className={`split${reverse ? " split--reverse" : ""}`}>
      <div id={project.slug} className="split__text">
        <h3 className="split__name">{project.name}</h3>
        <p className="split__tagline">{project.tagline}</p>
        {stats && (
          <dl className="split__stats">
            <div>
              <dt>Stars</dt>
              <dd>★ {stats.stars}</dd>
            </div>
            <div>
              <dt>Commits</dt>
              <dd>{stats.commits}</dd>
            </div>
            <div>
              <dt>Last commit</dt>
              <dd>
                <time dateTime={stats.lastCommitAt}>
                  {formatRelativeJa(stats.lastCommitAt)}
                  <span className="split__stats-abs">({formatDateTimeJst(stats.lastCommitAt)} JST)</span>
                </time>
              </dd>
            </div>
          </dl>
        )}
        <p className="split__desc">{project.description}</p>
        <div className="split__tags">
          {project.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
        <div className="split__links">
          <ExternalLink href={`https://github.com/${project.repo}`}>GitHub で見る</ExternalLink>
          {project.pypi && <ExternalLink href={project.pypi}>PyPI で見る</ExternalLink>}
        </div>
      </div>
      <div className="split__visual" aria-hidden="true">
        <Image
          src={project.image.src}
          width={project.image.width}
          height={project.image.height}
          alt=""
          sizes="(max-width: 60rem) 100vw, 50vw"
        />
      </div>
    </div>
  );
}
