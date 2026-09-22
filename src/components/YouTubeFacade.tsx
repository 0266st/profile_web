"use client";

import Image from "next/image";
import { useState } from "react";

// Shows only the thumbnail until the visitor asks to play: the real player is
// ~1MB of script and starts YouTube tracking the moment it loads.
export default function YouTubeFacade({ id, title }: { id: string; title: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        ref={(el) => el?.focus()}
        className="media__frame"
        src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  }

  return (
    <button type="button" className="media__facade" onClick={() => setPlaying(true)}>
      <Image
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        fill
        sizes="(min-width: 60rem) 34rem, 100vw"
        className="media__thumb"
      />
      <span className="media__play" aria-hidden="true" />
      <span className="sr-only">再生: {title}</span>
    </button>
  );
}
