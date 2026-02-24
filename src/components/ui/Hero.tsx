"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Hero() {
  const container = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".hero-text-fill", {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        stagger: 0.1,
      });
      gsap.from(".hero-text-acid", {
        x: -50,
        opacity: 0,
        duration: 1,
        delay: 0.4,
        ease: "power4.out",
      });
      gsap.from(".hero-intro", {
        opacity: 0,
        y: 20,
        duration: 1,
        delay: 0.6,
      });
    });

    return () => mm.revert();
  }, { scope: container });

  return (
    <section 
      ref={container} 
      className="relative min-h-screen flex items-center justify-center pt-32 px-10 pb-10 overflow-hidden"
    >
      {/* Background Shapes */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute border border-border-subtle bg-bg-surface/80 backdrop-blur-md w-[40vw] h-[40vh] top-[10%] -left-[10%]"
        />
        <div 
          className="absolute border border-accent-deep w-[200px] h-[600px] right-[10%] -bottom-[20%] rotate-12"
        />
      </div>

      <div className="relative z-10 text-center max-w-[1200px]">
        <div className="inline-block border border-accent text-accent px-3 py-1 text-xs tracking-widest uppercase -skew-x-12 mb-6">
          <span className="block skew-x-12 font-semibold">Product Designer</span>
        </div>
        
        <h1 className="text-[clamp(3rem,8vw,9rem)] leading-[0.9] -tracking-wide mb-6 text-transparent [-webkit-text-stroke:1px_var(--color-text-main)]">
          SYSTEMS
          <br />
          <span className="hero-text-fill text-text-main [-webkit-text-stroke:0]">& </span> 
          <span className="hero-text-acid text-accent [-webkit-text-stroke:0]">STRATEGY</span>
        </h1>
        
        <p className="hero-intro text-[clamp(1rem,1.5vw,1.25rem)] text-text-muted mx-auto max-w-[600px]">
          Transformando dados e pesquisas em arquiteturas de interfaces que escalam e convertem. Zero templates. Pura métrica e design intencional.
        </p>
      </div>
    </section>
  );
}
