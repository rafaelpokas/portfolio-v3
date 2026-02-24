import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/ui/Hero";
import StatsGrid from "@/components/ui/StatsGrid";
import PhysicsSkills from "@/components/interactive/PhysicsSkills";
import BadgeShowcase from "@/components/ui/BadgeShowcase";
import CertTimeline from "@/components/interactive/CertTimeline";
import BrutalistButton from "@/components/ui/BrutalistButton";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";

export default function Home() {
  return (
    <>
      {/* Skip to content — a11y */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:bg-accent focus:text-bg focus:px-4 focus:py-2 focus:font-display focus:text-xs focus:font-bold focus:tracking-wider"
      >
        Pular para o conteúdo
      </a>

      <Navbar />

      <main id="main-content">
        <Hero />
        <StatsGrid />
        <PhysicsSkills />
        <BadgeShowcase />
        <CertTimeline />
      </main>

      <footer className="py-20 px-6 md:px-10 border-t border-border-subtle flex flex-col md:flex-row gap-10 justify-between items-start md:items-center bg-bg-surface">
        <div className="font-display text-4xl md:text-6xl text-text-main">READY_</div>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <BrutalistButton
            href="mailto:rafapokas@hotmail.com"
            ariaLabel="Enviar email para rafapokas@hotmail.com"
          >
            rafapokas@hotmail.com
          </BrutalistButton>
          <BrutalistButton
            href="https://linkedin.com/in/rafaelpokas"
            variant="outline"
            target="_blank"
            ariaLabel="Abrir perfil LinkedIn de Rafael França"
          >
            LinkedIn
          </BrutalistButton>
          <BrutalistButton
            href="https://wa.me/5514991796593"
            variant="outline"
            target="_blank"
            ariaLabel="Enviar mensagem no WhatsApp"
          >
            WhatsApp
          </BrutalistButton>
        </div>
      </footer>

      <WhatsAppFloat />
    </>
  );
}
