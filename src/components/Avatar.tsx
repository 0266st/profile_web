import Image from "next/image";
import { AVATARS } from "@/lib/profile";

export default function Avatars() {
  return (
    <ul className="avatars">
      {AVATARS.map(({ handle, src }) => (
        <li key={handle} className="avatars__item">
          {src ? (
            <Image className="avatar" src={src} alt={`${handle} のアイコン`} width={240} height={240} priority />
          ) : (
            <div className="avatar avatar--placeholder" aria-hidden="true">
              icon
            </div>
          )}
          <span className="avatars__handle">{handle}</span>
        </li>
      ))}
    </ul>
  );
}
