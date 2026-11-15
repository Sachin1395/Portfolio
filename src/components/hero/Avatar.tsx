import Image from "next/image";
import { avatar } from "@/content/assets";
import { cn } from "@/lib/cn";
import { HdLayer } from "./HdLayer";

/**
 * The character, sized by its container's height. A closed-eyes patch sits
 * exactly over the eyes and flashes on for the blink (CSS, motion-safe).
 */
export function Avatar({ className, priority = false, sizes }: { className?: string; priority?: boolean; sizes: string }) {
  const { eyes } = avatar;
  return (
    <div className={cn("relative h-full", className)} style={{ aspectRatio: `${avatar.width} / ${avatar.height}` }}>
      <Image src={avatar.src} alt={avatar.alt} fill priority={priority} sizes={sizes} className="object-contain" />
      <HdLayer />
      <div
        aria-hidden="true"
        className="anim-blink absolute opacity-0"
        style={{ left: `${eyes.left}%`, top: `${eyes.top}%`, width: `${eyes.width}%`, height: `${eyes.height}%` }}
      >
        {/* Wider than the avatar's own sizes: the patch is small, and it must stay sharp in close-ups. */}
        <Image src={avatar.eyesSrc} alt="" fill priority={priority} sizes="(min-width: 768px) 640px, 320px" className="object-fill" />
      </div>
    </div>
  );
}
