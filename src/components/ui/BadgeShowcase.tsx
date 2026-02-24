"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionBadge from "@/components/ui/SectionBadge";

gsap.registerPlugin(ScrollTrigger);

const badges = [
  {
    id: "conversion-optimization",
    title: "Conversion Optimization",
    issuer: "Google",
    image: "/badges/conversion-optimization.png",
  },
  {
    id: "ai-powered-performance",
    title: "Google Ads AI-Powered Performance",
    issuer: "Google",
    image: "/badges/ai-powered-performance.png",
  },
  {
    id: "google-ads-measurement",
    title: "Google Ads Measurement",
    issuer: "Google",
    image: "/badges/google-ads-measurement.png",
  },
];

export default function BadgeShowcase() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Coin flip entrance for each badge
      gsap.utils.toArray<HTMLElement>(".badge-coin").forEach((coin, i) => {
        gsap.fromTo(
          coin,
          {
            rotateY: -180,
            opacity: 0,
            scale: 0.6,
          },
          {
            rotateY: 0,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            delay: i * 0.25,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: coin,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          },
        );
      });

      // Continuous subtle shimmer
      gsap.utils.toArray<HTMLElement>(".badge-shine").forEach((shine) => {
        gsap.to(shine, {
          x: "200%",
          duration: 3,
          ease: "power1.inOut",
          repeat: -1,
          repeatDelay: 4,
        });
      });
    });

    return () => mm.revert();
  }, { scope: container });

  return (
    <section
      ref={container}
      id="badges"
      className="relative py-24 md:py-32 px-6 md:px-10 border-b border-border-subtle bg-bg overflow-hidden"
    >
      {/* Decorative lines */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-border-subtle opacity-30" />
      <div className="absolute top-0 right-1/4 w-px h-full bg-border-subtle opacity-30" />

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <SectionBadge>Credenciais</SectionBadge>
          <h2 className="text-4xl md:text-5xl mb-4">Google Certified</h2>
          <p className="text-text-muted max-w-md mx-auto">
            Certificações oficiais que validam domínio em otimização,
            performance e métricas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-16">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className="badge-coin flex flex-col items-center gap-6 group"
              style={{ perspective: "800px", transformStyle: "preserve-3d" }}
            >
              {/* Coin container */}
              <div className="relative w-40 h-40 md:w-52 md:h-52">
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-full bg-accent/10 blur-xl scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />

                {/* Outer metallic ring */}
                <div className="absolute inset-0 rounded-full bg-linear-to-br from-accent/30 via-transparent to-accent/10 p-[3px] group-hover:rotate-360 transition-transform duration-[2s]">
                  <div className="w-full h-full rounded-full bg-bg-surface" />
                </div>

                {/* Badge image */}
                <div className="absolute inset-2 rounded-full overflow-hidden bg-white flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                  <Image
                    src={badge.image}
                    alt={`Certificação ${badge.title}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                  />

                  {/* Shine sweep */}
                  <div
                    className="badge-shine absolute inset-0 -translate-x-full"
                    style={{
                      background:
                        "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.15) 55%, transparent 60%)",
                    }}
                  />
                </div>

                {/* Dotted orbit ring */}
                <div className="absolute -inset-3 rounded-full border border-dashed border-accent/20 group-hover:border-accent/50 group-hover:rotate-90 transition-all duration-1000" />
              </div>

              {/* Label */}
              <div className="text-center">
                <p className="text-xs text-accent tracking-widest uppercase mb-1 font-semibold">
                  {badge.issuer}
                </p>
                <p className="text-sm text-text-muted">{badge.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
