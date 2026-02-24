"use client";

import { useEffect, useRef } from "react";
import Matter from "matter-js";
import SectionBadge from "@/components/ui/SectionBadge";

const techStack = [
  "Figma", "React Native", "Google Analytics", "CRO", "A/B Testing",
  "JavaScript", "HTML/CSS", "Design System", "Git", "ClickUp",
  "Scrum", "Wireframing", "Prototyping", "UX Research", "PIE Framework",
];

const colors = ["#CCFF00", "#F4F4F5", "#A1A1AA"];

export default function PhysicsSkills() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);

  useEffect(() => {
    if (!sceneRef.current) return;

    const { Engine, Render, Runner, Composite, Bodies, Events, World } = Matter;

    const width = sceneRef.current.clientWidth;
    const height = sceneRef.current.clientHeight;

    const engine = Engine.create();
    const world = engine.world;
    engineRef.current = engine;

    const render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width,
        height,
        background: "transparent",
        wireframes: false,
        pixelRatio: Math.min(typeof window !== "undefined" ? window.devicePixelRatio : 1, 2),
      },
    });
    renderRef.current = render;
    Render.run(render);

    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // Boundaries
    const tb = 50;
    Composite.add(world, [
      Bodies.rectangle(width / 2, height + tb / 2, width * 2, tb, { isStatic: true, render: { visible: false } }),
      Bodies.rectangle(-tb / 2, height / 2, tb, height * 2, { isStatic: true, render: { visible: false } }),
      Bodies.rectangle(width + tb / 2, height / 2, tb, height * 2, { isStatic: true, render: { visible: false } }),
    ]);

    // Create bodies
    const bodies: Matter.Body[] = [];
    techStack.forEach((item, i) => {
      const w = item.length * 15 + 40;
      const h = 50;
      const x = Math.random() * (width - w) + w / 2;
      const y = Math.random() * -500 - 100;
      const c = colors[i % colors.length];

      const body = Bodies.rectangle(x, y, w, h, {
        chamfer: { radius: 0 },
        restitution: 0.6,
        friction: 0.1,
        render: {
          fillStyle: c === "#CCFF00" ? "#CCFF00" : "#0a0a0a",
          strokeStyle: c === "#CCFF00" ? "transparent" : c,
          lineWidth: 1,
        },
        label: item,
      });
      bodies.push(body);
    });

    // Intersection Observer to trigger drop
    let hasDropped = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasDropped) {
            hasDropped = true;
            Composite.add(world, bodies);
          }
        });
      },
      { threshold: 0.1 },
    );
    observer.observe(sceneRef.current);

    // Repulsive hover/touch effect
    const mousePos = { x: -1000, y: -1000 };
    const onMouseMove = (e: MouseEvent) => {
      if (!sceneRef.current) return;
      const rect = sceneRef.current.getBoundingClientRect();
      mousePos.x = e.clientX - rect.left;
      mousePos.y = e.clientY - rect.top;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!sceneRef.current || !e.touches[0]) return;
      const rect = sceneRef.current.getBoundingClientRect();
      mousePos.x = e.touches[0].clientX - rect.left;
      mousePos.y = e.touches[0].clientY - rect.top;
    };
    const onTouchEnd = () => {
      mousePos.x = -1000;
      mousePos.y = -1000;
    };

    render.canvas.addEventListener("mousemove", onMouseMove);
    render.canvas.addEventListener("touchmove", onTouchMove, { passive: true });
    render.canvas.addEventListener("touchend", onTouchEnd);

    Events.on(engine, "beforeUpdate", () => {
      bodies.forEach((body) => {
        const dx = body.position.x - mousePos.x;
        const dy = body.position.y - mousePos.y;
        const distSq = dx * dx + dy * dy;
        const repelRadius = 200;

        if (distSq < repelRadius * repelRadius && distSq > 0) {
          const dist = Math.sqrt(distSq);
          const forceMagnitude = (repelRadius - dist) * 0.00015;
          Matter.Body.applyForce(body, body.position, {
            x: (dx / dist) * forceMagnitude,
            y: (dy / dist) * forceMagnitude,
          });
        }
      });
    });

    // Custom text rendering
    Events.on(render, "afterRender", () => {
      const context = render.context;
      context.font = "600 16px 'Space Grotesk', sans-serif";
      context.textAlign = "center";
      context.textBaseline = "middle";

      bodies.forEach((body) => {
        if (body.position.y > -100 && body.position.y < height + 100) {
          context.translate(body.position.x, body.position.y);
          context.rotate(body.angle);
          context.fillStyle = body.render.fillStyle === "#CCFF00" ? "#050505" : "#F4F4F5";
          context.fillText(body.label, 0, 0);
          context.rotate(-body.angle);
          context.translate(-body.position.x, -body.position.y);
        }
      });
    });

    // Debounced resize
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!sceneRef.current) return;
        const newWidth = sceneRef.current.clientWidth;
        const newHeight = sceneRef.current.clientHeight;
        render.canvas.width = newWidth * Math.min(window.devicePixelRatio, 2);
        render.canvas.height = newHeight * Math.min(window.devicePixelRatio, 2);
        render.canvas.style.width = `${newWidth}px`;
        render.canvas.style.height = `${newHeight}px`;
      }, 150);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      clearTimeout(resizeTimer);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      if (render.canvas) {
        render.canvas.removeEventListener("mousemove", onMouseMove);
        render.canvas.removeEventListener("touchmove", onTouchMove);
        render.canvas.removeEventListener("touchend", onTouchEnd);
        render.canvas.remove();
      }
      Render.stop(render);
      Runner.stop(runner);
      World.clear(world, false);
      Engine.clear(engine);
    };
  }, []);

  return (
    <section
      id="skills"
      className="relative h-[90vh] py-32 px-6 md:px-10 overflow-hidden border-b border-border-subtle flex flex-col"
    >
      <div className="absolute top-[120px] left-6 md:left-10 z-10 max-w-[400px] pointer-events-none">
        <SectionBadge>Tech Stack</SectionBadge>
        <h2 className="text-4xl md:text-5xl mb-4">Arsenal Tático</h2>
        <p className="text-text-muted">
          Desenvolvimento, Design e Dados colidindo em tempo real. Interaja com o ambiente.
        </p>
      </div>

      {/* Interaction hint — responsive */}
      <div className="absolute bottom-10 right-6 md:right-10 flex items-center gap-3 text-xs uppercase tracking-widest text-accent pointer-events-none">
        <span className="inline-block w-2 h-2 bg-accent rounded-full animate-pulse" />
        <span className="hidden md:inline">Passe o mouse</span>
        <span className="inline md:hidden">Toque e arraste</span>
      </div>

      {/* Screen reader fallback */}
      <ul className="sr-only" aria-label="Lista de habilidades técnicas">
        {techStack.map((skill) => (
          <li key={skill}>{skill}</li>
        ))}
      </ul>

      <div
        id="canvas-container"
        ref={sceneRef}
        role="img"
        aria-label="Canvas interativo de física com as habilidades técnicas"
        className="absolute inset-0 w-full h-full cursor-default"
      />
    </section>
  );
}
