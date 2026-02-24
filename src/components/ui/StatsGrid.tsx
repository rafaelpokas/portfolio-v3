"use client";

import { useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "4+", label: "Anos de Experiência" },
  { value: "20+", label: "Certificações Técnicas" },
  { value: "UX", label: "Google Certified" },
  { value: "CRO", label: "Conversão e Analytics" },
];

export default function StatsGrid() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    // Only run if user has no reduced motion preference
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".stat-box", {
        scrollTrigger: {
          trigger: container.current,
          start: "top 80%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
      });
    });

    return () => mm.revert();
  }, { scope: container });

  return (
    <section 
      id="about" 
      ref={container} 
      className="py-20 px-6 md:px-10 border-y border-border-subtle bg-bg-surface"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border-subtle">
        {stats.map((stat) => (
          <div 
            key={stat.label} 
            className="stat-box bg-bg-surface p-10 flex flex-col justify-between"
          >
            <div className="font-display text-5xl text-accent mb-4">
              {stat.value}
            </div>
            <div className="text-sm uppercase tracking-widest text-text-muted">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
