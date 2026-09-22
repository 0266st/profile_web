import type { CSSProperties } from "react";

// Two-line shell prompt: `root@ztssst.dev ~` then `❯ <command>`.
// With `typed`, the command types itself in once (clip-path reveal, no layout work).
export default function Prompt({ command, typed = false }: { command: string; typed?: boolean }) {
  return (
    <div className="prompt">
      <div>
        <span className="prompt__user">root</span>
        <span className="prompt__sep">@</span>
        <span className="prompt__host">ztssst.dev</span> <span className="prompt__path">~</span>
      </div>
      <div>
        <span className="prompt__arrow">❯</span>{" "}
        <span
          className={typed ? "prompt__cmd prompt__cmd--typed" : "prompt__cmd"}
          style={typed ? ({ "--steps": command.length + 1 } as CSSProperties) : undefined}
        >
          {command}
        </span>
      </div>
    </div>
  );
}
