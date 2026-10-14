import { Reveal } from "@/components/motion/reveal";
import { capabilities } from "@/content/capabilities";
import { techIcons } from "@/content/tech-icons";

function channel(hex: string) {
  const value = parseInt(hex.slice(1), 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255].map((part) => {
    const c = part / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
}

function faceFor(hex: string | undefined) {
  if (!hex) return { background: "var(--acid)", color: "var(--on-acid)" };
  const [r, g, b] = channel(hex);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  if (luminance < 0.02) return { background: "var(--paper)", color: "var(--ink)" };
  return { background: hex, color: luminance > 0.35 ? "#08080a" : "#ffffff" };
}

function monogram(name: string) {
  const letters = name.replace(/[^A-Za-z0-9 ]/g, "").split(" ");
  return letters.length > 1 ? letters.map((word) => word[0]).join("").slice(0, 2) : name.slice(0, 2);
}

function Tile({ name }: { name: string }) {
  const icon = techIcons[name];
  const face = faceFor(icon?.hex);
  return (
    <li className="stack-tile" aria-label={name}>
      <div className="stack-tile-inner">
        <div className="stack-tile-face stack-tile-front">
          {icon ? (
            <svg viewBox="0 0 24 24" aria-hidden className="stack-tile-logo">
              <path d={icon.path} fill="currentColor" />
            </svg>
          ) : (
            <span aria-hidden className="font-display text-[1.15rem] uppercase leading-none">
              {monogram(name)}
            </span>
          )}
          <span aria-hidden className="stack-tile-caption">
            {name}
          </span>
        </div>
        <div className="stack-tile-face stack-tile-back" style={face} aria-hidden>
          <span className="stack-tile-name">{name}</span>
        </div>
      </div>
    </li>
  );
}

export function StackBand() {
  return (
    <section aria-label="Tools I build with" className="block-ink">
      <div className="shell py-10 md:py-14">
        <Reveal
          stagger={0.07}
          className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 xl:grid-cols-6 xl:gap-x-[clamp(1rem,1.6vw,2rem)]"
        >
          {capabilities.map((group) => (
            <div key={group.title} className="min-w-0">
              <h3 className="meta flex items-center gap-2 text-paper/55">
                <span aria-hidden className="size-1.5 rounded-full bg-acid" />
                {group.title}
              </h3>
              <ul className="stack-tiles mt-4">
                {group.items.map((item) => (
                  <Tile key={item} name={item} />
                ))}
                {Array.from({ length: (3 - (group.items.length % 3)) % 3 }, (_, index) => (
                  <li key={`spare-${index}`} aria-hidden className="stack-tile stack-tile-spare" />
                ))}
              </ul>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
