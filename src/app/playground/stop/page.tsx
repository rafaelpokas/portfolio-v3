"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  RotateCcw,
  Printer,
  ArrowLeft,
  Timer,
  Shuffle,
  Check,
  X,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
type Tab = "sorteador" | "confeccionador";
type Difficulty = "tradicional" | "basico" | "medio" | "avancado" | "pro";
// Drawing phases: idle → counting (5s countdown) → revealed (show letter + start game timer)
type DrawPhase = "idle" | "counting" | "revealed";

interface Theme {
  id: string;
  name: string;
  difficulty: Difficulty;
}

// --- 120+ Smart themes ---
const ALL_THEMES: Theme[] = [
  { id: "t01", name: "Nome", difficulty: "tradicional" },
  { id: "t02", name: "Animal", difficulty: "tradicional" },
  { id: "t03", name: "Cidade", difficulty: "tradicional" },
  { id: "t04", name: "País", difficulty: "tradicional" },
  { id: "t05", name: "Objeto", difficulty: "tradicional" },
  { id: "t06", name: "Fruta", difficulty: "tradicional" },
  { id: "t07", name: "Cor", difficulty: "tradicional" },
  { id: "t08", name: "Marca", difficulty: "tradicional" },
  { id: "t09", name: "Profissão", difficulty: "tradicional" },
  { id: "t10", name: "Vegetal", difficulty: "tradicional" },
  { id: "b01", name: "Comida", difficulty: "basico" },
  { id: "b02", name: "Bebida", difficulty: "basico" },
  { id: "b03", name: "Esporte", difficulty: "basico" },
  { id: "b04", name: "Roupa", difficulty: "basico" },
  { id: "b05", name: "Nome Feminino", difficulty: "basico" },
  { id: "b06", name: "Nome Masculino", difficulty: "basico" },
  { id: "b07", name: "Sobrenome", difficulty: "basico" },
  { id: "b08", name: "Flor", difficulty: "basico" },
  { id: "b09", name: "Árvore", difficulty: "basico" },
  { id: "b10", name: "Doce / Sobremesa", difficulty: "basico" },
  { id: "b11", name: "Parte do Corpo", difficulty: "basico" },
  { id: "b12", name: "Instrumento Musical", difficulty: "basico" },
  { id: "b13", name: "Peixe", difficulty: "basico" },
  { id: "b14", name: "Pássaro", difficulty: "basico" },
  { id: "b15", name: "Meio de Transporte", difficulty: "basico" },
  { id: "b16", name: "Material Escolar", difficulty: "basico" },
  { id: "b17", name: "Eletrodoméstico", difficulty: "basico" },
  { id: "b18", name: "Móvel / Mobília", difficulty: "basico" },
  { id: "b19", name: "Condimento / Tempero", difficulty: "basico" },
  { id: "b20", name: "Artigo de Higiene", difficulty: "basico" },
  { id: "b21", name: "Inseto", difficulty: "basico" },
  { id: "b22", name: "Palavra em Inglês", difficulty: "basico" },
  { id: "b23", name: "Ferramenta", difficulty: "basico" },
  { id: "b24", name: "Animal da Fazenda", difficulty: "basico" },
  { id: "b25", name: "Tipo de Queijo", difficulty: "basico" },
  { id: "m01", name: "Série de TV", difficulty: "medio" },
  { id: "m02", name: "Programa de TV", difficulty: "medio" },
  { id: "m03", name: "Desenho Animado", difficulty: "medio" },
  { id: "m04", name: "Personagem de Filme", difficulty: "medio" },
  { id: "m05", name: "Ator / Atriz", difficulty: "medio" },
  { id: "m06", name: "Músico / Banda", difficulty: "medio" },
  { id: "m07", name: "Time de Futebol", difficulty: "medio" },
  { id: "m08", name: "Estado do Brasil", difficulty: "medio" },
  { id: "m09", name: "Rio do Brasil", difficulty: "medio" },
  { id: "m10", name: "Planeta / Astro", difficulty: "medio" },
  { id: "m11", name: "Item de Cozinha", difficulty: "medio" },
  { id: "m12", name: "Animal Marinho", difficulty: "medio" },
  { id: "m13", name: "Esporte Olímpico", difficulty: "medio" },
  { id: "m14", name: "Marca de Roupa", difficulty: "medio" },
  { id: "m15", name: "Marca de Carro", difficulty: "medio" },
  { id: "m16", name: "Capital de Estado", difficulty: "medio" },
  { id: "m17", name: "País da América do Sul", difficulty: "medio" },
  { id: "m18", name: "Tipo de Dança", difficulty: "medio" },
  { id: "m19", name: "Gênero Musical", difficulty: "medio" },
  { id: "m20", name: "Personagem de Série", difficulty: "medio" },
  { id: "m21", name: "Jogo de Tabuleiro", difficulty: "medio" },
  { id: "m22", name: "Remédio / Medicamento", difficulty: "medio" },
  { id: "m23", name: "Aplicativo de Celular", difficulty: "medio" },
  { id: "m24", name: "Marca de Celular", difficulty: "medio" },
  { id: "m25", name: "Tipo de Prato / Massa", difficulty: "medio" },
  { id: "m26", name: "Superherói", difficulty: "medio" },
  { id: "m27", name: "Personagem Histórico", difficulty: "medio" },
  { id: "m28", name: "Obra de Arte Famosa", difficulty: "medio" },
  { id: "m29", name: "Animal da Selva", difficulty: "medio" },
  { id: "m30", name: "Refeição do Dia", difficulty: "medio" },
  { id: "a01", name: "Coisa que tem buraco", difficulty: "avancado" },
  { id: "a02", name: "Coisa que é mole", difficulty: "avancado" },
  { id: "a03", name: "Coisa que faz barulho", difficulty: "avancado" },
  { id: "a04", name: "Coisa que cresce", difficulty: "avancado" },
  { id: "a05", name: "Coisa que é pegajosa", difficulty: "avancado" },
  { id: "a06", name: "Coisa que você pode dobrar", difficulty: "avancado" },
  { id: "a07", name: "Coisa que todo mundo tem em casa", difficulty: "avancado" },
  { id: "a08", name: "Coisa que você usa no banheiro", difficulty: "avancado" },
  { id: "a09", name: "Coisa que você pode colecionar", difficulty: "avancado" },
  { id: "a10", name: "Coisa que você carrega na bolsa", difficulty: "avancado" },
  { id: "a11", name: "Coisa que dura pouco", difficulty: "avancado" },
  { id: "a12", name: "Algo que você faz de manhã", difficulty: "avancado" },
  { id: "a13", name: "Coisa que você vê todo dia", difficulty: "avancado" },
  { id: "a14", name: "Algo que acontece só à noite", difficulty: "avancado" },
  { id: "a15", name: "Coisa que você ouve mas não vê", difficulty: "avancado" },
  { id: "a16", name: "Coisa que você nunca comeria", difficulty: "avancado" },
  { id: "a17", name: "Algo que você perdeu alguma vez", difficulty: "avancado" },
  { id: "a18", name: "O que te deixa animado", difficulty: "avancado" },
  { id: "a19", name: "Coisa que existe mas ninguém usa mais", difficulty: "avancado" },
  { id: "a20", name: "Algo que você usa quando está doente", difficulty: "avancado" },
  { id: "a21", name: "Coisa que você pode plantar", difficulty: "avancado" },
  { id: "a22", name: "Algo que envelhece", difficulty: "avancado" },
  { id: "a23", name: "Coisa que é redonda", difficulty: "avancado" },
  { id: "a24", name: "Algo que você pode comer cru", difficulty: "avancado" },
  { id: "a25", name: "Coisa que você compra no mercado", difficulty: "avancado" },
  { id: "a26", name: "Minha sobra favorita é:", difficulty: "avancado" },
  { id: "a27", name: "Coisa que você cheira antes de comprar", difficulty: "avancado" },
  { id: "a28", name: "Algo que você nunca viu mas existe", difficulty: "avancado" },
  { id: "a29", name: "Coisa que você usa na chuva", difficulty: "avancado" },
  { id: "a30", name: "Algo que você aprendeu com sua mãe", difficulty: "avancado" },
  { id: "p01", name: "Coisa que você pode chutar", difficulty: "pro" },
  { id: "p02", name: "Algo que cabe em uma mala", difficulty: "pro" },
  { id: "p03", name: "Coisa que todo mundo já quebrou", difficulty: "pro" },
  { id: "p04", name: "Algo que você sente mas não vê", difficulty: "pro" },
  { id: "p05", name: "Coisa que você faz quando está entediado", difficulty: "pro" },
  { id: "p06", name: "Algo que você compraria se fosse milionário", difficulty: "pro" },
  { id: "p07", name: "Coisa que você faria ao contrário", difficulty: "pro" },
  { id: "p08", name: "Algo pequeno mas muito importante", difficulty: "pro" },
  { id: "p09", name: "Coisa que desaparece com o tempo", difficulty: "pro" },
  { id: "p10", name: "Algo que está em todo lugar", difficulty: "pro" },
  { id: "p11", name: "Coisa que você só usa uma vez", difficulty: "pro" },
  { id: "p12", name: "Algo que vale mais do que parece", difficulty: "pro" },
  { id: "p13", name: "Coisa que você não jogaria fora nem pago", difficulty: "pro" },
  { id: "p14", name: "Algo que existe em pares", difficulty: "pro" },
  { id: "p15", name: "Coisa que ninguém quer mas todo mundo tem", difficulty: "pro" },
  { id: "p16", name: "Algo que te faz rir sempre", difficulty: "pro" },
  { id: "p17", name: "Coisa que você poderia fazer no escuro", difficulty: "pro" },
  { id: "p18", name: "Algo que mudou o mundo", difficulty: "pro" },
  { id: "p19", name: "Coisa que você começa mas raramente termina", difficulty: "pro" },
  { id: "p20", name: "Algo que conecta as pessoas", difficulty: "pro" },
  { id: "p21", name: "Coisa que você associa ao verão", difficulty: "pro" },
  { id: "p22", name: "Algo que começa fácil mas fica difícil", difficulty: "pro" },
  { id: "p23", name: "Coisa que você nunca faria em público", difficulty: "pro" },
  { id: "p24", name: "Algo que você daria de presente pra qualquer um", difficulty: "pro" },
  { id: "p25", name: "Coisa que pode ser perigosa mas também útil", difficulty: "pro" },
];

const DIFFICULTY_CONFIG: Record<Difficulty, { label: string; color: string; bg: string }> = {
  tradicional: { label: "Tradicional", color: "#f4f4f5", bg: "#27272a" },
  basico: { label: "Básico", color: "#4ade80", bg: "#052e16" },
  medio: { label: "Médio", color: "#facc15", bg: "#1c1400" },
  avancado: { label: "Avançado", color: "#fb923c", bg: "#1c0a00" },
  pro: { label: "Pro", color: "#f87171", bg: "#1c0000" },
};

const STOP_ACCENT = "#ff6b35";
const TOKENS = {
  bg: "#050505",
  card: "#0a0a0a",
  muted: "#141417",
  border: "rgba(255,255,255,0.08)",
  fg: "#f4f4f5",
  mutedFg: "#a1a1aa",
};

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const MAX_THEMES = 8;
const COUNTDOWN_SECONDS = 5;



export default function StopPage() {
  const [activeTab, setActiveTab] = useState<Tab>("sorteador");

  // --- Sorteador state ---
  const [activeLetters, setActiveLetters] = useState<Set<string>>(new Set(ALPHABET));
  const [drawnLetters, setDrawnLetters] = useState<string[]>([]);
  const [currentLetter, setCurrentLetter] = useState<string | null>(null);
  const [timerEnabled, setTimerEnabled] = useState(false);
  const [timerDuration, setTimerDuration] = useState(180);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showAlphabetEditor, setShowAlphabetEditor] = useState(false);

  // Draw phase: idle → counting (5s pre-reveal) → revealed
  const [drawPhase, setDrawPhase] = useState<DrawPhase>("idle");
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [pendingLetter, setPendingLetter] = useState<string | null>(null);

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const availablePool = ALPHABET.filter(
    (l) => activeLetters.has(l) && !drawnLetters.includes(l)
  );

  // — Countdown before revealing letter —
  // Note: drawnLetters is mutated in drawLetter(), NOT here, to avoid double-count.
  useEffect(() => {
    if (drawPhase !== "counting") return;
    countdownRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(countdownRef.current!);
          setCurrentLetter(pendingLetter);
          setDrawPhase("revealed");
          if (timerEnabled) {
            setTimeLeft(timerDuration);
            setTimerRunning(true);
          }
          return 0;
        }
        return c - 1;
      });
    }, 1000);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [drawPhase, pendingLetter, timerEnabled, timerDuration]);

  // — Game timer countdown (runs only during "revealed" phase) —
  useEffect(() => {
    if (!timerRunning) return;
    gameTimerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setTimerRunning(false);
          clearInterval(gameTimerRef.current!);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    };
  }, [timerRunning]);

  const drawLetter = () => {
    if (availablePool.length === 0 || drawPhase !== "idle") return;
    const idx = Math.floor(Math.random() * availablePool.length);
    const letter = availablePool[idx];
    // Add to history HERE (single source of truth — effect should not also do this)
    setDrawnLetters((prev) => [letter, ...prev]);
    setPendingLetter(letter);
    setCountdown(COUNTDOWN_SECONDS);
    setDrawPhase("counting");
    setTimerRunning(false);
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
  };

  const resetSorteador = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    setDrawnLetters([]);
    setCurrentLetter(null);
    setPendingLetter(null);
    setDrawPhase("idle");
    setTimerRunning(false);
    setTimeLeft(0);
    setCountdown(COUNTDOWN_SECONDS);
  };

  const toggleLetter = (letter: string) => {
    if (drawnLetters.includes(letter)) return;
    setActiveLetters((prev) => {
      const next = new Set(prev);
      if (next.has(letter)) next.delete(letter);
      else next.add(letter);
      return next;
    });
  };

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // Timer arc progress
  const timerProgress = timerEnabled && timerDuration > 0 ? timeLeft / timerDuration : 1;

  // --- Confeccionador state ---
  const [activeFilters, setActiveFilters] = useState<Set<Difficulty>>(new Set(["tradicional"]));
  const [selectedThemes, setSelectedThemes] = useState<Theme[]>([]);
  const [customThemeName, setCustomThemeName] = useState("");
  const [gameName, setGameName] = useState("STOP!");

  const toggleFilter = (d: Difficulty) => {
    if (d === "tradicional") return;
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(d)) next.delete(d);
      else next.add(d);
      return next;
    });
  };

  const filteredThemes = ALL_THEMES.filter((t) => activeFilters.has(t.difficulty));

  const toggleTheme = (theme: Theme) => {
    setSelectedThemes((prev) => {
      const exists = prev.find((t) => t.id === theme.id);
      if (exists) return prev.filter((t) => t.id !== theme.id);
      if (prev.length >= MAX_THEMES) return prev;
      return [...prev, theme];
    });
  };

  const addCustomTheme = useCallback(() => {
    const name = customThemeName.trim();
    if (!name || selectedThemes.length >= MAX_THEMES) return;
    const custom: Theme = { id: `custom-${Date.now()}`, name, difficulty: "basico" };
    setSelectedThemes((prev) => [...prev, custom]);
    setCustomThemeName("");
  }, [customThemeName, selectedThemes.length]);

  const removeSelected = (id: string) => {
    setSelectedThemes((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: TOKENS.bg, color: TOKENS.fg, fontFamily: "var(--font-body)" }}
    >
      {/* Nav */}
      <nav
        className="sticky top-0 z-50 border-b print:hidden"
        style={{ backgroundColor: TOKENS.bg, borderColor: TOKENS.border, backdropFilter: "blur(16px)" }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <a
              href="/playground"
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] opacity-50 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 transition-opacity"
              style={{ color: TOKENS.fg }}
              aria-label="Voltar ao Playground"
            >
              <ArrowLeft className="h-3 w-3" aria-hidden="true" />
              Playground
            </a>
            <div className="h-4 w-px" style={{ backgroundColor: TOKENS.border }} />
            <h1
              className="text-base font-black tracking-tight uppercase"
              style={{ fontFamily: "var(--font-display)", color: STOP_ACCENT }}
            >
              STOP
            </h1>
          </div>

          <div
            className="flex items-center gap-1 p-1"
            style={{ backgroundColor: TOKENS.muted }}
            role="tablist"
            aria-label="Modos do STOP"
          >
            {(["sorteador", "confeccionador"] as Tab[]).map((tab) => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-wider transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset"
                style={
                  activeTab === tab
                    ? { backgroundColor: TOKENS.card, color: TOKENS.fg }
                    : { color: TOKENS.mutedFg, opacity: 0.5 }
                }
              >
                {tab === "sorteador" ? (
                  <Shuffle className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <Printer className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {tab === "sorteador" ? "Sorteador" : "Confeccionador"}
              </button>
            ))}
          </div>

          <div className="w-32" />
        </div>
      </nav>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-6 py-10 print:p-0">
        <AnimatePresence mode="wait">
          {/* ── SORTEADOR ── */}
          {activeTab === "sorteador" && (
            <motion.div
              key="sorteador"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-8"
            >
              {/* Letter display card */}
              <div
                className="relative flex w-full max-w-2xl flex-col items-center justify-center border overflow-hidden"
                style={{ backgroundColor: TOKENS.card, borderColor: TOKENS.border, height: "420px" }}
              >
                {/* Timer arc — only shown during revealed phase */}
                {timerEnabled && timerRunning && drawPhase === "revealed" && (
                  <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" style={{ opacity: 0.12 }}>
                      <circle
                        cx="50" cy="50" r="48"
                        fill="none"
                        stroke={STOP_ACCENT}
                        strokeWidth="4"
                        strokeDasharray={`${timerProgress * 301.6} 301.6`}
                        strokeLinecap="butt"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                )}

                {/* Timer display */}
                {timerEnabled && drawPhase === "revealed" && (
                  <div
                    className="absolute top-6 flex items-center gap-3"
                    style={{ color: timerRunning ? STOP_ACCENT : TOKENS.mutedFg }}
                    aria-live="polite"
                    aria-label={timerRunning ? `Tempo restante: ${formatTime(timeLeft)}` : "Timer parado"}
                  >
                    <Timer className="h-4 w-4" aria-hidden="true" />
                    <span className="text-xl font-black tabular-nums">
                      {formatTime(timerRunning ? timeLeft : timerDuration)}
                    </span>
                  </div>
                )}

                {/* Center display — countdown or letter */}
                <AnimatePresence mode="wait">
                  {drawPhase === "counting" ? (
                    // 5-second countdown before reveal
                    <motion.div
                      key={`countdown-${countdown}`}
                      initial={{ scale: 1.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="flex flex-col items-center gap-4"
                      aria-live="assertive"
                      aria-label={`A letra aparece em ${countdown}`}
                    >
                      <span
                        className="text-[160px] font-black leading-none tabular-nums"
                        style={{ color: STOP_ACCENT, fontFamily: "var(--font-display)" }}
                      >
                        {countdown}
                      </span>
                      <span
                        className="text-[11px] uppercase tracking-[0.3em] font-black"
                        style={{ color: TOKENS.mutedFg }}
                      >
                        preparar…
                      </span>
                    </motion.div>
                  ) : drawPhase === "revealed" && currentLetter ? (
                    // Revealed letter
                    <motion.div
                      key={`letter-${currentLetter}`}
                      initial={{ scale: 0.5, opacity: 0, y: 30 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.5, opacity: 0, y: -30 }}
                      transition={{ type: "spring", stiffness: 200, damping: 18 }}
                      className="text-[180px] font-black leading-none"
                      style={{ color: STOP_ACCENT, fontFamily: "var(--font-display)" }}
                      aria-live="assertive"
                      aria-label={`Letra sorteada: ${currentLetter}`}
                    >
                      {currentLetter}
                    </motion.div>
                  ) : (
                    // Idle state
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-[180px] font-black leading-none select-none"
                      style={{ color: TOKENS.border, fontFamily: "var(--font-display)" }}
                      aria-hidden="true"
                    >
                      ?
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Available count */}
                <div
                  className="absolute bottom-3 text-[10px] uppercase tracking-widest"
                  style={{ color: TOKENS.mutedFg }}
                  aria-live="polite"
                >
                  {availablePool.length} letras disponíveis
                </div>

                {/* Action buttons */}
                <div className="absolute bottom-10 flex gap-3">
                  <button
                    onClick={drawLetter}
                    disabled={availablePool.length === 0 || drawPhase !== "idle"}
                    className="flex items-center gap-2 px-10 h-14 text-[11px] font-black uppercase tracking-[0.2em] disabled:opacity-30 transition-opacity active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{ backgroundColor: STOP_ACCENT, color: "#050505" }}
                    aria-label="Sortear próxima letra"
                  >
                    <Shuffle className="h-4 w-4" aria-hidden="true" />
                    {drawPhase === "counting" ? "Sortear…" : "Sortear"}
                  </button>
                  <button
                    onClick={resetSorteador}
                    className="flex items-center justify-center h-14 w-14 transition-opacity active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{ border: `1px solid ${TOKENS.border}`, backgroundColor: TOKENS.muted, color: TOKENS.fg }}
                    aria-label="Reiniciar sorteador"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Controls row */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Timer settings */}
                <div
                  className="p-5 space-y-4 border"
                  style={{ backgroundColor: TOKENS.card, borderColor: TOKENS.border }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Timer className="h-4 w-4" style={{ color: STOP_ACCENT }} aria-hidden="true" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        Timer por rodada (opcional)
                      </span>
                    </div>
                    <button
                      role="switch"
                      aria-checked={timerEnabled}
                      aria-label={timerEnabled ? "Desativar timer" : "Ativar timer"}
                      onClick={() => setTimerEnabled((v) => !v)}
                      className="relative h-6 w-11 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      style={{ backgroundColor: timerEnabled ? STOP_ACCENT : TOKENS.muted, borderRadius: "999px" }}
                    >
                      <span
                        className="absolute top-0.5 h-5 w-5 transition-transform"
                        style={{
                          backgroundColor: timerEnabled ? "#050505" : TOKENS.fg,
                          borderRadius: "50%",
                          transform: timerEnabled ? "translateX(22px)" : "translateX(2px)",
                        }}
                      />
                    </button>
                  </div>
                  {timerEnabled && (
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase tracking-widest" style={{ color: TOKENS.mutedFg }}>
                        Duração
                      </p>
                      <div className="flex gap-2 flex-wrap" role="radiogroup" aria-label="Duração do timer">
                        {[60, 120, 180, 300].map((s) => (
                          <button
                            key={s}
                            role="radio"
                            aria-checked={timerDuration === s}
                            onClick={() => setTimerDuration(s)}
                            className="px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2"
                            style={
                              timerDuration === s
                                ? { backgroundColor: STOP_ACCENT, color: "#050505" }
                                : { border: `1px solid ${TOKENS.border}`, color: TOKENS.mutedFg, backgroundColor: TOKENS.muted }
                            }
                          >
                            {s < 60 ? `${s}s` : `${s / 60}min`}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Alphabet editor */}
                <div className="border" style={{ backgroundColor: TOKENS.card, borderColor: TOKENS.border }}>
                  <button
                    onClick={() => setShowAlphabetEditor((v) => !v)}
                    aria-expanded={showAlphabetEditor}
                    aria-controls="alphabet-editor"
                    className="w-full flex items-center justify-between p-5 text-[10px] font-black uppercase tracking-widest transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset"
                  >
                    <span>Gerenciar Alfabeto ({activeLetters.size} ativas)</span>
                    {showAlphabetEditor ? (
                      <ChevronUp className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>

                  {showAlphabetEditor && (
                    <div id="alphabet-editor" className="px-5 pb-5">
                      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Letras do alfabeto">
                        {ALPHABET.map((l) => {
                          const isDrawn = drawnLetters.includes(l);
                          const isActive = activeLetters.has(l);
                          return (
                            <button
                              key={l}
                              onClick={() => toggleLetter(l)}
                              disabled={isDrawn}
                              aria-pressed={isActive}
                              aria-label={`Letra ${l}${isDrawn ? " (já sorteada)" : isActive ? " (ativa)" : " (desativada)"}`}
                              className="w-8 h-8 text-xs font-black transition-all active:scale-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset"
                              style={{
                                backgroundColor: isDrawn
                                  ? STOP_ACCENT + "33"
                                  : isActive
                                  ? TOKENS.muted
                                  : "transparent",
                                border: `1px solid ${isDrawn ? STOP_ACCENT + "66" : TOKENS.border}`,
                                color: isDrawn ? STOP_ACCENT : isActive ? TOKENS.fg : TOKENS.mutedFg,
                                opacity: isDrawn ? 0.6 : isActive ? 1 : 0.35,
                                textDecoration: !isActive && !isDrawn ? "line-through" : "none",
                              }}
                            >
                              {l}
                            </button>
                          );
                        })}
                      </div>
                      <p
                        className="mt-3 text-[9px] uppercase tracking-wider"
                        style={{ color: TOKENS.mutedFg }}
                      >
                        Clique para ativar/desativar ·{" "}
                        <span style={{ color: STOP_ACCENT }}>Laranja</span> = já sorteada
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* History */}
              {drawnLetters.length > 0 && (
                <div className="w-full" aria-label="Histórico de letras sorteadas">
                  <p
                    className="mb-3 text-[10px] font-black uppercase tracking-widest"
                    style={{ color: TOKENS.mutedFg }}
                  >
                    Histórico ({drawnLetters.length})
                  </p>
                  <div className="flex flex-wrap gap-2" role="list">
                    {drawnLetters.map((l, i) => (
                      <motion.div
                        role="listitem"
                        key={`${l}-${i}`}
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="h-11 w-11 flex items-center justify-center font-black text-sm"
                        style={
                          i === 0
                            ? { backgroundColor: STOP_ACCENT, color: "#050505" }
                            : { backgroundColor: TOKENS.card, color: TOKENS.fg, border: `1px solid ${TOKENS.border}` }
                        }
                        aria-label={`Letra ${l}${i === 0 ? " (última sorteada)" : ""}`}
                      >
                        {l}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ── CONFECCIONADOR ── */}
          {activeTab === "confeccionador" && (
            <motion.div
              key="confeccionador"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8 print:block"
            >
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 print:hidden">
                {/* Left: filters + theme picker */}
                <div className="space-y-6">
                  {/* Game name */}
                  <div
                    className="p-5 border space-y-3"
                    style={{ backgroundColor: TOKENS.card, borderColor: TOKENS.border }}
                  >
                    <label
                      htmlFor="stop-game-name"
                      className="text-[10px] font-black uppercase tracking-widest block"
                      style={{ color: TOKENS.mutedFg }}
                    >
                      Nome do Jogo
                    </label>
                    <input
                      id="stop-game-name"
                      type="text"
                      name="gameName"
                      value={gameName}
                      onChange={(e) => setGameName(e.target.value)}
                      placeholder="Ex: STOP!…"
                      autoComplete="off"
                      className="w-full p-3 font-bold outline-none text-sm focus-visible:ring-2 focus-visible:ring-inset"
                      style={{ backgroundColor: TOKENS.muted, color: TOKENS.fg, border: `1px solid ${TOKENS.border}` }}
                    />
                  </div>

                  {/* Difficulty filters */}
                  <div>
                    <p
                      className="mb-3 text-[10px] font-black uppercase tracking-widest"
                      style={{ color: TOKENS.mutedFg }}
                    >
                      Dificuldade (múltipla escolha)
                    </p>
                    <div className="flex flex-wrap gap-2" role="group" aria-label="Filtros de dificuldade">
                      {(["tradicional", "basico", "medio", "avancado", "pro"] as Difficulty[]).map((d) => {
                        const cfg = DIFFICULTY_CONFIG[d];
                        const isActive = activeFilters.has(d);
                        const isLocked = d === "tradicional";
                        return (
                          <button
                            key={d}
                            onClick={() => toggleFilter(d)}
                            disabled={isLocked}
                            aria-pressed={isActive}
                            aria-label={`Filtro ${cfg.label}${isLocked ? " (sempre ativo)" : ""}`}
                            className="flex items-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-wider transition-all focus-visible:outline-none focus-visible:ring-2"
                            style={{
                              backgroundColor: isActive ? cfg.bg : "transparent",
                              border: `1px solid ${isActive ? cfg.color + "66" : TOKENS.border}`,
                              color: isActive ? cfg.color : TOKENS.mutedFg,
                            }}
                          >
                            {isActive && <Check className="h-3 w-3" aria-hidden="true" />}
                            {cfg.label}
                            {isLocked && " ✓"}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Theme grid */}
                  <div>
                    <p
                      className="mb-3 text-[10px] font-black uppercase tracking-widest"
                      style={{ color: TOKENS.mutedFg }}
                    >
                      Escolha os temas ({selectedThemes.length}/{MAX_THEMES})
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2" role="group" aria-label="Temas disponíveis">
                      {filteredThemes.map((theme) => {
                        const isSelected = selectedThemes.some((t) => t.id === theme.id);
                        const limitReached = selectedThemes.length >= MAX_THEMES;
                        const cfg = DIFFICULTY_CONFIG[theme.difficulty];
                        return (
                          <button
                            key={theme.id}
                            onClick={() => toggleTheme(theme)}
                            disabled={!isSelected && limitReached}
                            aria-pressed={isSelected}
                            aria-label={`Tema: ${theme.name}${isSelected ? " (selecionado)" : ""}${!isSelected && limitReached ? " (limite atingido)" : ""}`}
                            className="flex items-start gap-2 p-3 text-left text-xs transition-all active:scale-[0.98] disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset"
                            style={{
                              backgroundColor: isSelected ? STOP_ACCENT + "15" : TOKENS.card,
                              border: `1px solid ${isSelected ? STOP_ACCENT + "66" : TOKENS.border}`,
                            }}
                          >
                            <span
                              className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                              style={{ backgroundColor: cfg.color }}
                              aria-hidden="true"
                            />
                            <span
                              className="font-bold leading-snug"
                              style={{ color: isSelected ? TOKENS.fg : TOKENS.mutedFg }}
                            >
                              {theme.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom theme */}
                  <div
                    className="p-5 border space-y-3"
                    style={{ backgroundColor: TOKENS.card, borderColor: TOKENS.border }}
                  >
                    <label
                      htmlFor="custom-theme-input"
                      className="text-[10px] font-black uppercase tracking-widest block"
                      style={{ color: TOKENS.mutedFg }}
                    >
                      Adicionar tema personalizado
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="custom-theme-input"
                        type="text"
                        name="customTheme"
                        value={customThemeName}
                        onChange={(e) => setCustomThemeName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addCustomTheme()}
                        placeholder="Ex: Minha sobra é:…"
                        autoComplete="off"
                        className="flex-1 p-3 font-bold outline-none text-sm focus-visible:ring-2 focus-visible:ring-inset"
                        style={{ backgroundColor: TOKENS.muted, color: TOKENS.fg, border: `1px solid ${TOKENS.border}` }}
                      />
                      <button
                        onClick={addCustomTheme}
                        disabled={!customThemeName.trim() || selectedThemes.length >= MAX_THEMES}
                        aria-label="Adicionar tema personalizado"
                        className="px-4 flex items-center justify-center disabled:opacity-30 transition-opacity focus-visible:outline-none focus-visible:ring-2"
                        style={{ backgroundColor: STOP_ACCENT, color: "#050505" }}
                      >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: selected + print */}
                <div className="space-y-4">
                  <div
                    className="p-5 border space-y-3 sticky top-24"
                    style={{ backgroundColor: TOKENS.card, borderColor: TOKENS.border }}
                  >
                    <div className="flex items-center justify-between">
                      <p
                        className="text-[10px] font-black uppercase tracking-widest"
                        style={{ color: TOKENS.mutedFg }}
                      >
                        Temas selecionados
                      </p>
                      <span
                        className="text-[10px] font-black tabular-nums"
                        style={{ color: selectedThemes.length >= MAX_THEMES ? STOP_ACCENT : TOKENS.mutedFg }}
                        aria-live="polite"
                      >
                        {selectedThemes.length}/{MAX_THEMES}
                      </span>
                    </div>

                    {selectedThemes.length === 0 ? (
                      <p className="text-xs py-4 text-center" style={{ color: TOKENS.mutedFg }}>
                        Nenhum tema selecionado
                      </p>
                    ) : (
                      <ol className="space-y-1.5" aria-label="Temas selecionados em ordem">
                        {selectedThemes.map((t, i) => (
                          <li
                            key={t.id}
                            className="flex items-center justify-between p-2.5"
                            style={{ backgroundColor: TOKENS.muted, border: `1px solid ${TOKENS.border}` }}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className="text-[10px] font-black w-5 text-center shrink-0 tabular-nums"
                                style={{ color: STOP_ACCENT }}
                              >
                                {i + 1}
                              </span>
                              <span
                                className="text-xs font-bold truncate"
                                style={{ color: TOKENS.fg }}
                              >
                                {t.name}
                              </span>
                            </div>
                            <button
                              onClick={() => removeSelected(t.id)}
                              aria-label={`Remover tema: ${t.name}`}
                              className="transition-opacity hover:opacity-100 opacity-50 ml-2 shrink-0 focus-visible:outline-none focus-visible:ring-2"
                              style={{ color: TOKENS.mutedFg }}
                            >
                              <X className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </li>
                        ))}
                      </ol>
                    )}

                    <button
                      onClick={() => window.print()}
                      disabled={selectedThemes.length === 0}
                      className="w-full h-12 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] disabled:opacity-30 transition-opacity mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                      style={{ backgroundColor: STOP_ACCENT, color: "#050505" }}
                      aria-label="Imprimir folha do STOP"
                    >
                      <Printer className="h-4 w-4" aria-hidden="true" />
                      Imprimir Folha
                    </button>

                    <p className="text-[9px] text-center leading-relaxed" style={{ color: TOKENS.mutedFg }}>
                      A4 paisagem · até {MAX_THEMES} temas + TOTAL
                    </p>
                  </div>
                </div>
              </div>

              {/* Print sheet */}
              {selectedThemes.length > 0 && (
                <div className="flex justify-center print:block print:justify-normal">
                  <div
                    id="stop-print-sheet"
                    className="stop-print-sheet shadow-2xl print:shadow-none"
                    role="img"
                    aria-label="Folha de jogo STOP para impressão"
                    style={{
                      backgroundColor: "white",
                      color: "#0a0a0a",
                      width: "297mm",
                      height: "210mm",
                      boxSizing: "border-box",
                      padding: "8mm 10mm 6mm",
                      display: "flex",
                      flexDirection: "column",
                      fontFamily: "Arial, sans-serif",
                    }}
                  >
                    {/* Title row */}
                    <div
                      style={{
                        marginBottom: "3mm",
                        borderBottom: "2pt solid #0a0a0a",
                        paddingBottom: "2mm",
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "space-between",
                      }}
                    >
                      <div style={{ fontSize: "20pt", fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase", lineHeight: 1.1 }}>
                        {gameName}
                      </div>
                      <div style={{ fontSize: "6.5pt", color: "#64748b", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                        igual = 5pts · único = 10pts
                      </div>
                    </div>

                    {/* The grid: header row (theme names) + body (writing space) */}
                    <div
                      style={{
                        flex: 1,
                        display: "grid",
                        gridTemplateColumns: `repeat(${selectedThemes.length}, 1fr) 0.6fr`,
                        gridTemplateRows: "auto 1fr",
                        border: "1pt solid #0a0a0a",
                        overflow: "hidden",
                      }}
                    >
                      {/* Header row — theme names written horizontally at the top */}
                      {[...selectedThemes, { id: "total", name: "TOTAL" } as Theme].map((t, i) => {
                        const isTotal = t.id === "total";
                        return (
                          <div
                            key={`hdr-${t.id}`}
                            style={{
                              borderRight: i < selectedThemes.length ? "1pt solid #0a0a0a" : "none",
                              borderBottom: "1.5pt solid #0a0a0a",
                              backgroundColor: isTotal ? "#f0f0f0" : i % 2 === 0 ? "#fafafa" : "white",
                              padding: "2.5mm 3mm",
                              fontSize: isTotal ? "7pt" : "7.5pt",
                              fontWeight: 900,
                              textTransform: "uppercase" as const,
                              letterSpacing: "0.04em",
                              color: "#0a0a0a",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap" as const,
                              textAlign: isTotal ? "center" as const : "left" as const,
                            }}
                          >
                            {t.name}
                          </div>
                        );
                      })}

                      {/* Body row — the writing area (empty, one tall row per column) */}
                      {[...selectedThemes, { id: "total", name: "TOTAL" } as Theme].map((t, i) => {
                        const isTotal = t.id === "total";
                        return (
                          <div
                            key={`body-${t.id}`}
                            style={{
                              borderRight: i < selectedThemes.length ? "1pt solid #0a0a0a" : "none",
                              backgroundColor: isTotal ? "#fafafa" : "white",
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <style>{`
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body { background: white !important; margin: 0 !important; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          .stop-print-sheet {
            width: 297mm !important;
            height: 210mm !important;
            margin: 0 !important;
            box-shadow: none !important;
            padding: 10mm 12mm 8mm !important;
          }
          @page { size: A4 landscape; margin: 0; }
        }
      `}</style>
    </div>
  );
}
