"use client";

import { useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import SectionBadge from "@/components/ui/SectionBadge";

gsap.registerPlugin(ScrollTrigger);

const certifications = [
  { issuer: "Google Digital Academy", title: "Otimização de Conversão", date: "Fev 2026", code: "175071342" },
  { issuer: "Google Digital Academy", title: "Anúncios de Alta Performance IA", date: "Fev 2026", code: "175061822" },
  { issuer: "Google", title: "Google UX Design", date: "Dez 2025", code: "PRWPVN7DWX4R" },
  { issuer: "Google", title: "UX for Social Good & Jobs", date: "Dez 2025", code: "XFCKEZ8OBZAA" },
  { issuer: "Google", title: "Build Dynamic UI for Websites", date: "Dez 2025", code: "7H7Q5TZW9ZNY" },
  { issuer: "Google", title: "High-Fidelity Prototypes in Figma", date: "Dez 2025", code: "DEMK6PZA1HC7" },
  { issuer: "Google", title: "UX Research & Test Concepts", date: "Dez 2025", code: "5RHWEHXN4VPM" },
  { issuer: "Google", title: "Wireframes & Low-Fi Prototypes", date: "Dez 2025", code: "GN53IQZ0M9S2" },
  { issuer: "Google", title: "UX Design Process: Empathize", date: "Dez 2025", code: "7YWA6H0BTKQT" },
  { issuer: "Google", title: "Foundations of UX Design", date: "Nov 2025", code: "QIQBRNCSPEY5" },
  { issuer: "Google", title: "Accelerate Job Search with AI", date: "Nov 2025", code: "FETDFP160BPX" },
  { issuer: "Univ. do Chile", title: "Marketing Gerencial", date: "Dez 2025", code: "H1C0Y5AA4687" },
  { issuer: "Packt", title: "Product Management For UX", date: "Dez 2025", code: "1F652H8HWIM7" },
  { issuer: "Univ. of Pennsylvania", title: "Viral Marketing", date: "Dez 2025", code: "TKV7269FD7GZ" },
  { issuer: "Univ. of London", title: "Brand Management", date: "Dez 2025", code: "RKGNE6L4AE80" },
  { issuer: "AzureBrasil.cloud", title: "IA Generativa no Azure", date: "Set 2025", code: "260073ac" },
  { issuer: "Estácio", title: "Especialização ChatGPT", date: "Ago 2024", code: "04af30a4" },
  { issuer: "ClickUp", title: "Advanced AI / Expert / Admin / Novice", date: "Nov 2024", code: "Multiple" },
  { issuer: "Canva", title: "Visual Suite, AI, Education & Marketing", date: "Nov/Dez 2025", code: "Multiple" },
  { issuer: "Rocketseat", title: "Discover - Fundamentar", date: "Mai 2022", code: "-" },
  { issuer: "Harvard University", title: "CS50", date: "Set 2022", code: "285bed3c" },
  { issuer: "Microsoft", title: "Microsoft Cyber Leader", date: "Dez 2018", code: "-" },
  { issuer: "Unicamp", title: "Desenvolvimento de Apps", date: "Ago 2021", code: "-" }
];

export default function CertTimeline() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const rows = gsap.utils.toArray<HTMLElement>('.gsap-row');
      
      rows.forEach((row, i) => {
        const card = row.querySelector('.gsap-card');
        const textNode = row.querySelector('.depth-text');
        const marker = row.querySelector('.timeline-node');
        
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 90%",
            end: "top 40%",
            scrub: 1
          }
        });

        tl.from(textNode, { y: -100, opacity: 0.5, scale: 0.8 }, 0);
        
        const xOffset = i % 2 === 0 ? 50 : -50;
        tl.from(card, { x: xOffset, opacity: 0, rotationY: i % 2 === 0 ? -10 : 10 }, 0.2);
        
        tl.from(marker, { scale: 0, opacity: 0, backgroundColor: "#CCFF00" }, 0.4);
      });
    });

    return () => mm.revert(); // cleanup
  }, { scope: container });

  return (
    <section id="certs" className="relative py-32 bg-bg">
      <div className="sticky top-0 z-10 px-6 md:px-10 pb-20 bg-linear-to-b from-bg to-transparent">
        <SectionBadge>Histórico Cinético</SectionBadge>
        <h2 className="text-5xl leading-tight">Certificações<br />& Licenças</h2>
      </div>
      
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10" ref={container}>
        {/* Spine */}
        <div className="absolute top-0 bottom-0 left-5 md:left-1/2 w-px bg-border-subtle md:-translate-x-1/2" />

        {certifications.map((cert, i) => {
          const year = cert.date.slice(-4);
          const isEven = i % 2 === 0;

          return (
            <div key={i} className={`cert-row gsap-row relative flex items-center mb-[120px] clear-both flex-col md:flex-row pl-16 md:pl-0 ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
              
              {/* Timeline marker */}
              <div className="timeline-node absolute left-5 md:left-1/2 top-1/2 w-3 h-3 border border-accent bg-bg -translate-y-1/2 md:-translate-x-1/2 z-10" />
              
              {/* Parallax Background Text */}
              <div 
                className={`depth-text absolute font-display text-6xl md:text-8xl text-[rgba(255,255,255,0.06)] [-webkit-text-stroke:1px_rgba(255,255,255,0.15)] z-0 pointer-events-none whitespace-nowrap top-[-50px]
                  ${isEven ? 'md:-left-[10%] md:right-auto left-0' : 'md:-right-[10%] md:left-auto left-0'}`}
                aria-hidden="true"
              >
                {year}
              </div>

              {/* Card Container Layout switch */}
              <div className={`cert-content w-full md:w-[42%] relative z-10 ${isEven ? 'md:pl-10 text-left' : 'md:pr-10 md:text-right'}`}>
                <article className="cert-card gsap-card relative p-6 md:p-8 border border-border-subtle bg-bg-surface/60 backdrop-blur-md">
                  {/* Brutalist Corner Decor */}
                  <div className="absolute -top-px -left-px w-5 h-5 border-t-2 border-l-2 border-accent" />
                  
                  <div className="text-xs tracking-widest text-accent mb-2 uppercase">
                    {cert.issuer}
                  </div>
                  <div className="font-display text-xl mb-4 leading-snug">
                    {cert.title}
                  </div>
                  <div className="text-sm text-text-muted flex flex-col gap-1">
                    <span>Date: {cert.date}</span>
                    {cert.code !== '-' && <span>ID: {cert.code}</span>}
                  </div>
                </article>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}
