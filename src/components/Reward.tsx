"use client";

import { useState } from "react";

export default function Reward() {
  const [open, setOpen] = useState(false);

  if (open) {
    return (
      <>
        <p className="memo__gotcha" role="status">
          ひっかかった～^^
        </p>
        <div className="media media--video memo__reward">
          <iframe
            ref={(el) => el?.focus()}
            className="media__frame"
            src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0"
            title="ご褒美"
            allow="autoplay; encrypted-media; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </>
    );
  }

  return (
    <button
      type="button"
      className="btn btn--cta memo__button"
      onClick={() => setOpen(true)}
    >
      ご褒美を受け取る
    </button>
  );
}
