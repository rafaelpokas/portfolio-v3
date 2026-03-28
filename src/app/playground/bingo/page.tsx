"use client";

import React, { useState } from "react";
import {
  Trophy,
  Printer,
  RotateCcw,
  Palette,
  Play,
  History,
  Settings2,
  Dice5,
  LayoutGrid,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Types ---
type Tab = "caller" | "generator";

// --- Bingo Logic ---
const generateBingoNumbers = () => {
  const config: Record<string, [number, number]> = {
    B: [1, 15],
    I: [16, 30],
    N: [31, 45],
    G: [46, 60],
    O: [61, 75],
  };
  const columns: Record<string, number[]> = {};
  Object.keys(config).forEach((k) => {
    const [min, max] = config[k];
    const range = Array.from({ length: max - min + 1 }, (_, i) => i + min);
    const selected: number[] = [];
    for (let i = 0; i < 5; i++) {
      const idx = Math.floor(Math.random() * range.length);
      selected.push(range.splice(idx, 1)[0]);
    }
    columns[k] = selected.sort((a, b) => a - b);
  });
  return columns;
};

// Design tokens — always dark
const TOKENS = {
  bg: "#050505",
  card: "#0a0a0a",
  muted: "#141417",
  border: "rgba(255,255,255,0.08)",
  fg: "#f4f4f5",
  mutedFg: "#a1a1aa",
};

// --- Main Page ---
export default function BingoPage() {
  const [activeTab, setActiveTab] = useState<Tab>("caller");
  const [accentColor, setAccentColor] = useState("#ccff00");

  const [sheets, setSheets] = useState(1);
  const [gameName, setGameName] = useState("BINGO");
  const [freeText, setFreeText] = useState("FREE");
  const [generatedPages, setGeneratedPages] = useState<
    { id: number; data: Record<string, number[]> }[][]
  >([]);

  const [maxNumber, setMaxNumber] = useState(75);
  const [pool, setPool] = useState<number[]>(() =>
    Array.from({ length: 75 }, (_, i) => i + 1)
  );
  const [history, setHistory] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);

  const handleMaxNumberChange = (value: number) => {
    setMaxNumber(value);
    setPool(Array.from({ length: value }, (_, i) => i + 1));
    setHistory([]);
    setCurrentNumber(null);
  };

  const resetCaller = () => {
    setPool(Array.from({ length: maxNumber }, (_, i) => i + 1));
    setHistory([]);
    setCurrentNumber(null);
  };

  const drawNumber = () => {
    if (pool.length === 0) return;
    const idx = Math.floor(Math.random() * pool.length);
    const newPool = [...pool];
    const num = newPool.splice(idx, 1)[0];
    setPool(newPool);
    setHistory((h) => [num, ...h]);
    setCurrentNumber(num);
  };

  const generateCards = () => {
    const cardsPerPage = 6;
    const pages = [];
    for (let s = 0; s < sheets; s++) {
      const cards = [];
      for (let c = 0; c < cardsPerPage; c++) {
        cards.push({
          id: Math.floor(Math.random() * 900000) + 100000,
          data: generateBingoNumbers(),
        });
      }
      pages.push(cards);
    }
    setGeneratedPages(pages);
  };

  // Shared button style helpers — use inline color directly to avoid CSS-var inheritance issues
  const accentBg = { backgroundColor: accentColor, color: "#050505" };

  return (
    <div
      className="min-h-screen font-sans print:bg-white"
      style={{ backgroundColor: TOKENS.bg, color: TOKENS.fg, fontFamily: "var(--font-body)" }}
    >
      {/* Nav */}
      <nav
        className="sticky top-0 z-50 border-b backdrop-blur-xl print:hidden"
        style={{ backgroundColor: TOKENS.bg, borderColor: TOKENS.border }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Left: back + title */}
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
            <div className="flex items-center gap-2">
              <div
                className="flex h-7 w-7 items-center justify-center"
                style={accentBg}
                aria-hidden="true"
              >
                <Dice5 className="h-4 w-4" />
              </div>
              <h1
                className="text-base font-black tracking-tight uppercase"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {gameName}
              </h1>
            </div>
          </div>

          {/* Center: tabs */}
          <div
            className="flex items-center gap-1 p-1"
            style={{ backgroundColor: TOKENS.muted }}
            role="tablist"
            aria-label="Modos do Bingo"
          >
            {(["caller", "generator"] as Tab[]).map((tab) => (
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
                {tab === "caller" ? (
                  <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {tab === "caller" ? "Sorteador" : "Gerador"}
              </button>
            ))}
          </div>

          {/* Right: accent picker */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 px-3 py-2"
              style={{ border: `1px solid ${TOKENS.border}`, backgroundColor: TOKENS.card }}
            >
              <Palette className="h-3.5 w-3.5" style={{ color: TOKENS.mutedFg }} aria-hidden="true" />
              <label htmlFor="accent-color-picker" className="sr-only">
                Cor do Acento
              </label>
              <input
                id="accent-color-picker"
                type="color"
                value={accentColor}
                onChange={(e) => setAccentColor(e.target.value)}
                className="h-5 w-5 cursor-pointer border-none bg-transparent"
                title="Cor do acento"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-10 print:p-0">
        <AnimatePresence mode="wait">
          {activeTab === "caller" ? (
            <motion.div
              key="caller"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center gap-8"
            >
              {/* Number display */}
              <div
                className="relative flex h-[420px] w-full max-w-2xl flex-col items-center justify-center border overflow-hidden"
                style={{ backgroundColor: TOKENS.card, borderColor: TOKENS.border }}
              >
                {/* Max number selector */}
                <div
                  className="absolute top-6 flex items-center gap-2 text-xs"
                  style={{ color: TOKENS.mutedFg }}
                >
                  <Settings2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <label htmlFor="max-number-select" className="sr-only">
                    Limite de números
                  </label>
                  <select
                    id="max-number-select"
                    value={maxNumber}
                    onChange={(e) => handleMaxNumberChange(parseInt(e.target.value))}
                    className="bg-transparent font-bold outline-none uppercase tracking-wider text-[10px] cursor-pointer"
                    style={{ color: TOKENS.fg }}
                  >
                    <option value={75}>Limite 75</option>
                    <option value={90}>Limite 90</option>
                    <option value={100}>Limite 100</option>
                  </select>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentNumber}
                    initial={{ scale: 0.6, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.6, opacity: 0, y: -20 }}
                    transition={{ type: "spring", stiffness: 220, damping: 18 }}
                    className="text-[140px] font-black tracking-tighter leading-none tabular-nums"
                    style={{
                      color: accentColor,
                      fontFamily: "var(--font-display)",
                    }}
                    aria-live="polite"
                    aria-atomic="true"
                    aria-label={currentNumber ? `Número sorteado: ${currentNumber}` : "Nenhum número sorteado"}
                  >
                    {currentNumber ?? "--"}
                  </motion.div>
                </AnimatePresence>

                <div
                  className="absolute bottom-3 text-[10px] uppercase tracking-widest"
                  style={{ color: TOKENS.mutedFg }}
                  aria-live="polite"
                >
                  {pool.length} restantes
                </div>

                {/* Buttons */}
                <div className="absolute bottom-10 flex gap-3">
                  <button
                    onClick={drawNumber}
                    disabled={pool.length === 0}
                    className="flex items-center gap-2 px-10 h-14 text-[11px] font-black uppercase tracking-[0.2em] disabled:opacity-30 transition-opacity active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{ ...accentBg }}
                    aria-label="Sortear próximo número"
                  >
                    <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                    Sortear
                  </button>
                  <button
                    onClick={resetCaller}
                    className="flex items-center justify-center h-14 w-14 transition-opacity active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{
                      border: `1px solid ${TOKENS.border}`,
                      backgroundColor: TOKENS.muted,
                      color: TOKENS.fg,
                    }}
                    aria-label="Reiniciar sorteio"
                  >
                    <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* History */}
              <div className="w-full" aria-label="Histórico de números sorteados">
                <div
                  className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-1"
                  style={{ color: TOKENS.mutedFg }}
                >
                  <History className="h-3.5 w-3.5" aria-hidden="true" />
                  Histórico ({history.length})
                </div>
                <div className="flex flex-wrap gap-2" role="list">
                  {history.map((num, i) => (
                    <motion.div
                      role="listitem"
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      key={`${num}-${i}`}
                      className="flex h-11 w-11 items-center justify-center font-black text-sm tabular-nums"
                      style={
                        i === 0
                          ? accentBg
                          : { backgroundColor: TOKENS.card, color: TOKENS.fg, border: `1px solid ${TOKENS.border}` }
                      }
                      aria-label={`Número ${num}${i === 0 ? " (último sorteado)" : ""}`}
                    >
                      {num}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="generator"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid gap-8 lg:grid-cols-[320px_1fr] print:block"
            >
              {/* Controls */}
              <div className="space-y-6 print:hidden">
                <div
                  className="border p-7 space-y-5"
                  style={{ backgroundColor: TOKENS.card, borderColor: TOKENS.border }}
                >
                  <h2
                    className="font-black text-base uppercase tracking-wider"
                    style={{ fontFamily: "var(--font-display)", color: TOKENS.fg }}
                  >
                    Configurar Cartelas
                  </h2>

                  {/* Sheets count */}
                  <div className="space-y-2">
                    <label
                      htmlFor="sheets-input"
                      className="text-[10px] font-black uppercase tracking-widest block"
                      style={{ color: TOKENS.mutedFg }}
                    >
                      Folhas A4 (6 por folha)
                    </label>
                    <input
                      id="sheets-input"
                      type="number"
                      name="sheets"
                      inputMode="numeric"
                      value={sheets}
                      onChange={(e) => setSheets(Math.max(1, parseInt(e.target.value) || 1))}
                      min={1}
                      max={20}
                      autoComplete="off"
                      className="w-full p-3 font-bold outline-none text-sm focus-visible:ring-2 focus-visible:ring-inset"
                      style={{ backgroundColor: TOKENS.muted, color: TOKENS.fg, border: `1px solid ${TOKENS.border}` }}
                    />
                  </div>

                  {/* Game name */}
                  <div className="space-y-2">
                    <label
                      htmlFor="game-name-input"
                      className="text-[10px] font-black uppercase tracking-widest block"
                      style={{ color: TOKENS.mutedFg }}
                    >
                      Nome do Jogo
                    </label>
                    <input
                      id="game-name-input"
                      type="text"
                      name="gameName"
                      value={gameName}
                      onChange={(e) => setGameName(e.target.value)}
                      placeholder="Ex: BINGO…"
                      autoComplete="off"
                      className="w-full p-3 font-bold outline-none text-sm focus-visible:ring-2 focus-visible:ring-inset"
                      style={{ backgroundColor: TOKENS.muted, color: TOKENS.fg, border: `1px solid ${TOKENS.border}` }}
                    />
                  </div>

                  {/* Free cell text */}
                  <div className="space-y-2">
                    <label
                      htmlFor="free-text-input"
                      className="text-[10px] font-black uppercase tracking-widest block"
                      style={{ color: TOKENS.mutedFg }}
                    >
                      Texto do Centro
                    </label>
                    <input
                      id="free-text-input"
                      type="text"
                      name="freeText"
                      value={freeText}
                      onChange={(e) => setFreeText(e.target.value)}
                      placeholder="Ex: FREE…"
                      autoComplete="off"
                      className="w-full p-3 font-bold outline-none text-sm focus-visible:ring-2 focus-visible:ring-inset"
                      style={{ backgroundColor: TOKENS.muted, color: TOKENS.fg, border: `1px solid ${TOKENS.border}` }}
                    />
                  </div>

                  <button
                    onClick={generateCards}
                    className="w-full h-12 text-sm font-black uppercase tracking-wider transition-opacity hover:opacity-90 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{ ...accentBg }}
                  >
                    Gerar {sheets * 6} Cartelas
                  </button>
                  <button
                    onClick={() => window.print()}
                    disabled={generatedPages.length === 0}
                    className="w-full h-12 font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 disabled:opacity-30 transition-opacity hover:opacity-80 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                    style={{
                      border: `1px solid ${TOKENS.border}`,
                      backgroundColor: TOKENS.muted,
                      color: TOKENS.fg,
                    }}
                    aria-label="Imprimir todas as cartelas geradas"
                  >
                    <Printer className="h-4 w-4" aria-hidden="true" /> Imprimir Todas
                  </button>

                  {generatedPages.length > 0 && (
                    <p
                      className="text-[10px] text-center uppercase tracking-wider"
                      style={{ color: TOKENS.mutedFg }}
                      aria-live="polite"
                    >
                      {generatedPages.length} página(s) · {generatedPages.length * 6} cartelas
                    </p>
                  )}
                </div>
              </div>

              {/* A4 Preview — landscape 3×2 = 6 cards */}
              <div className="flex flex-col items-center gap-10 print:block">
                {generatedPages.length === 0 && (
                  <div
                    className="flex h-64 w-full items-center justify-center border text-sm uppercase tracking-widest print:hidden"
                    style={{ borderColor: TOKENS.border, color: TOKENS.mutedFg }}
                  >
                    Clique em &ldquo;Gerar Cartelas&rdquo;
                  </div>
                )}
                {generatedPages.map((page, pIdx) => (
                  <div
                    key={pIdx}
                    className="bingo-print-page shadow-2xl print:shadow-none"
                    role="img"
                    aria-label={`Página ${pIdx + 1} de cartelas de Bingo`}
                    style={{
                      backgroundColor: "white",
                      width: "297mm",
                      height: "210mm",
                      flexShrink: 0,
                    }}
                  >
                    {/* 3 cols × 2 rows = 6 cards */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gridTemplateRows: "1fr 1fr",
                        gap: "6mm",
                        padding: "8mm",
                        height: "100%",
                        boxSizing: "border-box",
                      }}
                    >
                      {page.map((card) => (
                        <div
                          key={card.id}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            border: "1.5pt solid #0a0a0a",
                            overflow: "hidden",
                          }}
                        >
                          {/* BINGO header */}
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(5, 1fr)",
                              backgroundColor: accentColor,
                              color: "#050505",
                              textAlign: "center",
                              padding: "3mm 0",
                              fontFamily: "Arial Black, sans-serif",
                              fontSize: "14pt",
                              fontWeight: 900,
                            }}
                          >
                            {["B", "I", "N", "G", "O"].map((l) => (
                              <span key={l}>{l}</span>
                            ))}
                          </div>

                          {/* Numbers grid */}
                          <div
                            style={{
                              flex: 1,
                              display: "grid",
                              gridTemplateColumns: "repeat(5, 1fr)",
                              gridTemplateRows: "repeat(5, 1fr)",
                              borderTop: "1pt solid #0a0a0a",
                            }}
                          >
                            {["B", "I", "N", "G", "O"].map((col, cIdx) =>
                              [0, 1, 2, 3, 4].map((row) => {
                                const isFree = row === 2 && cIdx === 2;
                                return (
                                  <div
                                    key={`${col}-${row}`}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      border: "0.5pt solid #e2e8f0",
                                      fontSize: "12pt",
                                      fontWeight: 700,
                                      color: "#0a0a0a",
                                      fontFamily: "Arial, sans-serif",
                                      backgroundColor: isFree ? "#f8f8f8" : "white",
                                    }}
                                  >
                                    {isFree ? (
                                      <div
                                        style={{
                                          width: "80%",
                                          height: "80%",
                                          border: `2pt solid ${accentColor}`,
                                          borderRadius: "50%",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          fontSize: "6pt",
                                          fontWeight: 900,
                                          color: accentColor,
                                          textAlign: "center",
                                          textTransform: "uppercase",
                                          transform: "rotate(-12deg)",
                                        }}
                                      >
                                        {freeText}
                                      </div>
                                    ) : (
                                      card.data[col][row]
                                    )}
                                  </div>
                                );
                              })
                            )}
                          </div>

                          {/* Footer */}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              padding: "2mm 3mm",
                              borderTop: "1pt solid #0a0a0a",
                              fontSize: "6pt",
                              fontWeight: 700,
                              color: "#64748b",
                              backgroundColor: "#f8fafc",
                              fontFamily: "Arial, sans-serif",
                            }}
                          >
                            <span>
                              ID: <b style={{ color: "#0a0a0a" }}>#{card.id}</b>
                            </span>
                            <span style={{ textTransform: "uppercase" }}>{gameName}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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
          .bingo-print-page {
            width: 297mm !important;
            height: 210mm !important;
            margin: 0 !important;
            page-break-after: always;
            box-shadow: none !important;
          }
          @page { size: A4 landscape; margin: 0; }
        }
      `}</style>
    </div>
  );
}
