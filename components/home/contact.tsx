import { ArrowUpRight, BadgeQuatrefoil } from "@/components/icons";
import { Magnetic } from "@/components/motion/magnetic";
import { Reveal } from "@/components/motion/reveal";
import { SplitHeadline } from "@/components/motion/split-headline";
import { company, contactHref, copy } from "@/content/company";

const subject = encodeURIComponent("Project enquiry — Harshil Gohil");
const body = encodeURIComponent(
  ["What we're building:", "", "Deadline:", "", "The constraint we can't move:", ""].join(
    "\n",
  ),
);

const primaryHref = company.email
  ? `${contactHref}?subject=${subject}&body=${body}`
  : contactHref;

const details = [
  ...(company.email
    ? [{ label: "Email", value: company.email, href: `mailto:${company.email}` }]
    : []),
  { label: "GitHub", value: company.githubLabel, href: company.github },
  { label: "X", value: company.xLabel, href: company.x },
  { label: "3D portfolio", value: "Hollow Manor", href: company.showcase },
];

export function Contact() {
  return (
    <section id="contact" className="block-acid">
      <div className="shell py-16 md:py-24">
        <div className="flex items-start justify-between gap-8">
          <SplitHeadline as="h2" className="huge max-w-[14ch]">
            {copy.contactTitle}
          </SplitHeadline>
          <BadgeQuatrefoil className="hidden size-16 shrink-0 text-on-acid lg:block" />
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <p className="lede text-on-acid/75">{copy.contactBody}</p>

            <Magnetic className="mt-10 inline-block">
              <a
                href={primaryHref}
                data-cursor="write"
                className="group inline-flex items-center gap-4 rounded-full bg-ink px-8 py-5 text-white transition-transform duration-500 ease-out hover:scale-[1.03]"
              >
                <span className="text-base font-medium tracking-[-0.01em]">
                  Get in touch
                </span>
                <ArrowUpRight className="size-4 transition-transform duration-500 ease-out group-hover:translate-x-1" />
              </a>
            </Magnetic>
          </Reveal>

          <Reveal
            as="dl"
            stagger={0.08}
            className="grid content-start gap-5 lg:col-span-5 lg:col-start-8"
          >
            {details.map((detail) => (
              <div
                key={detail.label}
                className="flex items-baseline justify-between gap-6 border-t border-on-acid/25 pt-4"
              >
                <dt className="meta text-on-acid/60">{detail.label}</dt>
                <dd className="text-right text-lg tracking-[-0.01em]">
                  <a
                    href={detail.href}
                    target={detail.href.startsWith("http") ? "_blank" : undefined}
                    rel={detail.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="underline decoration-on-acid/40 hover:decoration-on-acid">
                    {detail.value}
                  </a>
                </dd>
              </div>
            ))}
            <div className="border-t border-on-acid/25 pt-4">
              <dt className="meta text-on-acid/60">Based in</dt>
              <dd className="mt-2 text-lg leading-snug tracking-[-0.01em]">
                {company.address.city}, {company.address.region}, India
              </dd>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
