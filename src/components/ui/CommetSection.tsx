"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import SectionBadge from "@/components/ui/SectionBadge";

gsap.registerPlugin(ScrollTrigger);

const COMMET_URL = "https://commet.pro";

export default function CommetSection() {
  const container = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".commet-photo", {
          scrollTrigger: { trigger: container.current, start: "top 75%" },
          x: -40,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
        });
        gsap.from(".commet-reveal", {
          scrollTrigger: { trigger: container.current, start: "top 75%" },
          y: 30,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
        });
      });

      return () => mm.revert();
    },
    { scope: container },
  );

  return (
    <section
      id="commet"
      ref={container}
      className="relative py-24 md:py-32 px-6 md:px-10 border-b border-border-subtle bg-bg-surface overflow-hidden"
    >
      {/* Brand accent shape */}
      <div
        className="absolute border border-accent-deep w-[220px] h-[220px] -top-[60px] -right-[60px] rotate-12 pointer-events-none opacity-60"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
        {/* Photo */}
        <div className="commet-photo relative w-full max-w-sm mx-auto md:mx-0">
          <div className="relative border border-border-subtle bg-bg">
            {/* Brutalist corner brackets */}
            <div className="absolute -top-px -left-px w-6 h-6 border-t-2 border-l-2 border-accent z-10" />
            <div className="absolute -bottom-px -right-px w-6 h-6 border-b-2 border-r-2 border-accent z-10" />

            <Image
              src="/rafael-franca.jpg"
              alt="Rafael França, CPDO da Commet"
              width={1000}
              height={1000}
              className="w-full h-auto grayscale-[0.15] contrast-[1.05]"
              priority={false}
            />

            {/* Caption chip */}
            <div className="absolute bottom-3 left-3 bg-accent text-bg px-3 py-1 font-display text-[10px] font-bold tracking-widest uppercase">
              Rafael França · cpdo
            </div>
          </div>
        </div>

        {/* Copy + CTA */}
        <div>
          <div className="commet-reveal">
            <SectionBadge>Studio</SectionBadge>
          </div>

          <h2 className="commet-reveal text-4xl md:text-5xl mb-6">
            CPDO na <span className="text-accent">Commet</span>
          </h2>

          <p className="commet-reveal text-text-muted mb-8">
            Lidero produto e design na Commet — um studio de tecnologia, IA e
            performance que constrói sites, software, automações e sistemas de
            crescimento para empresas B2B. O mesmo rigor de métricas e design
            intencional deste portfolio aplicado em escala.
          </p>

          {/* Commet wordmark */}
          <Image
            src="/commet-logo.svg"
            alt="Commet"
            width={170}
            height={56}
            className="commet-reveal h-10 w-auto mb-8"
          />

          <div className="commet-reveal flex flex-col sm:flex-row gap-4">
            <a
              href={COMMET_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visitar o site da Commet"
              className="group min-w-[44px] min-h-[44px] px-7 py-3 inline-flex items-center justify-center gap-2 bg-accent text-bg font-display text-xs font-bold tracking-wider hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[4px_4px_0_var(--color-accent-deep)] transition-transform"
            >
              Conhecer a Commet
              <ArrowUpRight
                className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
