"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Trophy,
  Printer,
  RotateCcw,
  Moon,
  Sun,
  Palette,
  Play,
  History,
  Settings2,
  Dice5,
  LayoutGrid,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// --- Utilities ---
function cn(...inputs: Parameters<typeof clsx>) {
  return twMerge(clsx(inputs));
}

// --- Types ---
type Tab = "caller" | "generator";

// --- Bingo Logic ---
const generateBingoNumbers = () => {
  const config: Record<string, [number, number]> = {
    B: [1, 15], I: [16, 30], N: [31, 45], G: [46, 60], O: [61, 75],
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

const hexToHsl = (hex: string) => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
};

// --- UI Primitives ---
type BtnVariant = "primary" | "secondary" | "outline" | "ghost";
type BtnSize = "default" | "lg" | "icon";

const BingoButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: BtnVariant;
    size?: BtnSize;
  }
>(({ className, variant = "primary", size = "default", ...props }, ref) => {
  const variants: Record<BtnVariant, string> = {
    primary: "bg-[--pg-primary] text-white hover:opacity-90 shadow-lg",
    secondary: "bg-[--pg-muted] text-[--pg-fg] hover:opacity-80",
    outline: "border border-[--pg-border] bg-transparent hover:bg-[--pg-muted]",
    ghost: "hover:bg-[--pg-muted]",
  };
  const sizes: Record<BtnSize, string> = {
    default: "px-4 py-2.5 text-sm",
    lg: "px-8 py-4 text-lg",
    icon: "h-10 w-10 p-0",
  };
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
});
BingoButton.displayName = "BingoButton";

const BingoCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "rounded-3xl border border-[--pg-border] bg-[--pg-card] shadow-sm",
      className
    )}
  >
    {children}
  </div>
);

// --- Main Page Component ---
export default function PlaygroundPage() {
  const [activeTab, setActiveTab] = useState<Tab>("caller");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [primaryColor, setPrimaryColor] = useState("#2563eb");

  const [sheets, setSheets] = useState(1);
  const [gameName, setGameName] = useState("IMPACT BINGO");
  const [freeText, setFreeText] = useState("FREE");
  const [generatedPages, setGeneratedPages] = useState<
    { id: number; data: Record<string, number[]> }[][]
  >([]);

  const [maxNumber, setMaxNumber] = useState(75);
  const [pool, setPool] = useState<number[]>([]);
  const [history, setHistory] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);

  // Apply theme tokens to this component's root element only
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.style.setProperty("--pg-bg", "#111113");
      root.style.setProperty("--pg-card", "#1a1a1e");
      root.style.setProperty("--pg-muted", "#27272a");
      root.style.setProperty("--pg-border", "rgba(255,255,255,0.1)");
      root.style.setProperty("--pg-fg", "#f4f4f5");
      root.style.setProperty("--pg-muted-fg", "#a1a1aa");
    } else {
      root.style.setProperty("--pg-bg", "#f4f4f5");
      root.style.setProperty("--pg-card", "#ffffff");
      root.style.setProperty("--pg-muted", "#e4e4e7");
      root.style.setProperty("--pg-border", "rgba(0,0,0,0.1)");
      root.style.setProperty("--pg-fg", "#09090b");
      root.style.setProperty("--pg-muted-fg", "#71717a");
    }
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.style.setProperty("--pg-primary", `hsl(${hexToHsl(primaryColor)})`);
  }, [primaryColor]);

  const resetCaller = useCallback(() => {
    setPool(Array.from({ length: maxNumber }, (_, i) => i + 1));
    setHistory([]);
    setCurrentNumber(null);
  }, [maxNumber]);

  useEffect(() => { resetCaller(); }, [maxNumber, resetCaller]);

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
    const pages = [];
    for (let s = 0; s < sheets; s++) {
      const cards = [];
      for (let c = 0; c < 4; c++) {
        cards.push({ id: Math.floor(Math.random() * 900000) + 100000, data: generateBingoNumbers() });
      }
      pages.push(cards);
    }
    setGeneratedPages(pages);
  };

  return (
    <div
      style={{ backgroundColor: "var(--pg-bg)", color: "var(--pg-fg)" }}
      className="min-h-screen font-sans transition-colors duration-300"
    >
      {/* Nav */}
      <nav
        style={{ backgroundColor: "var(--pg-bg)", borderColor: "var(--pg-border)" }}
        className="sticky top-0 z-50 border-b backdrop-blur-xl print:hidden"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: "var(--pg-primary)", color: "white" }}>
              <Dice5 className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-black tracking-tight uppercase" style={{ color: "var(--pg-fg)" }}>
              {gameName}
            </h1>
          </div>

          <div className="flex items-center gap-1 rounded-2xl p-1" style={{ backgroundColor: "var(--pg-muted)" }}>
            {(["caller", "generator"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all",
                  activeTab === tab ? "shadow-sm" : "opacity-60 hover:opacity-100"
                )}
                style={
                  activeTab === tab
                    ? { backgroundColor: "var(--pg-card)", color: "var(--pg-fg)" }
                    : { color: "var(--pg-muted-fg)" }
                }
              >
                {tab === "caller" ? <Trophy className="h-4 w-4" /> : <LayoutGrid className="h-4 w-4" />}
                {tab === "caller" ? "Sorteador" : "Gerador"}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl p-2" style={{ border: "1px solid var(--pg-border)", backgroundColor: "var(--pg-card)" }}>
              <Palette className="h-4 w-4" style={{ color: "var(--pg-muted-fg)" }} />
              <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="h-6 w-6 cursor-pointer border-none bg-transparent" />
            </div>
            <BingoButton variant="outline" size="icon" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </BingoButton>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-8 print:p-0">
        <AnimatePresence mode="wait">
          {activeTab === "caller" ? (
            <motion.div key="caller" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center gap-8">
              <div className="relative flex h-[440px] w-full max-w-2xl flex-col items-center justify-center rounded-[40px] shadow-2xl overflow-hidden"
                style={{ backgroundColor: "var(--pg-card)", border: "1px solid var(--pg-border)" }}>
                <div className="absolute top-8 flex items-center gap-2" style={{ color: "var(--pg-muted-fg)" }}>
                  <Settings2 className="h-4 w-4" />
                  <select value={maxNumber} onChange={(e) => setMaxNumber(parseInt(e.target.value))} className="bg-transparent font-bold outline-none" style={{ color: "var(--pg-fg)" }}>
                    <option value={75}>Limite 75</option>
                    <option value={90}>Limite 90</option>
                    <option value={100}>Limite 100</option>
                  </select>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentNumber}
                    initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
                    animate={{ scale: 1, opacity: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="text-[12rem] font-black tracking-tighter leading-none"
                    style={{ color: "var(--pg-primary)" }}
                  >
                    {currentNumber ?? "--"}
                  </motion.div>
                </AnimatePresence>

                <div className="absolute bottom-10 flex gap-4">
                  <BingoButton size="lg" onClick={drawNumber} disabled={pool.length === 0} className="h-16 px-12">
                    <Play className="mr-2 h-6 w-6 fill-current" /> Sortear Próximo
                  </BingoButton>
                  <BingoButton variant="outline" size="lg" onClick={resetCaller} className="h-16 w-16 px-0">
                    <RotateCcw className="h-6 w-6" />
                  </BingoButton>
                </div>
              </div>

              <div className="w-full">
                <div className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest px-2" style={{ color: "var(--pg-muted-fg)" }}>
                  <History className="h-4 w-4" /> Histórico ({history.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {history.map((num, i) => (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      key={num}
                      className="flex h-12 w-12 items-center justify-center rounded-xl font-bold text-lg"
                      style={
                        i === 0
                          ? { backgroundColor: "var(--pg-primary)", color: "white" }
                          : { backgroundColor: "var(--pg-card)", color: "var(--pg-fg)", border: "1px solid var(--pg-border)" }
                      }
                    >
                      {num}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="generator" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="grid gap-8 lg:grid-cols-[340px,1fr] print:block">
              {/* Controls */}
              <div className="space-y-6 print:hidden">
                <BingoCard className="p-8 space-y-5">
                  <h3 className="font-black text-xl" style={{ color: "var(--pg-fg)" }}>Configurar Cartelas</h3>

                  {[
                    { label: "Folhas A4 (4 por folha)", type: "number", value: sheets, onChange: (v: string) => setSheets(parseInt(v)) },
                    { label: "Nome do Jogo", type: "text", value: gameName, onChange: setGameName, placeholder: "Ex: IMPACT BINGO" },
                    { label: "Texto do Centro", type: "text", value: freeText, onChange: setFreeText, placeholder: "Ex: FREE" },
                  ].map(({ label, type, value, onChange, placeholder }) => (
                    <div key={label} className="space-y-2">
                      <label className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--pg-muted-fg)" }}>{label}</label>
                      <input
                        type={type}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="w-full rounded-xl p-4 font-bold outline-none"
                        style={{ backgroundColor: "var(--pg-muted)", color: "var(--pg-fg)", border: "1px solid var(--pg-border)" }}
                      />
                    </div>
                  ))}

                  <BingoButton className="w-full h-14 text-lg" onClick={generateCards}>Gerar Cartelas</BingoButton>
                  <BingoButton variant="outline" className="w-full h-14" onClick={() => window.print()}>
                    <Printer className="mr-2 h-5 w-5" /> Imprimir Todas
                  </BingoButton>
                </BingoCard>
              </div>

              {/* A4 Preview */}
              <div className="flex flex-col items-center gap-12 print:block">
                {generatedPages.map((page, pIdx) => (
                  <div key={pIdx} className="page-print shadow-2xl print:shadow-none bg-white" style={{ width: "210mm", height: "297mm" }}>
                    <div className="grid h-full grid-cols-2 grid-rows-2 gap-[8mm] p-[10mm]">
                      {page.map((card) => (
                        <div key={card.id} className="card-bingo flex flex-col border-[2pt] border-slate-900 rounded-lg overflow-hidden h-full">
                          <div className="grid grid-cols-5 bg-slate-900 text-white text-[24pt] font-black text-center py-2">
                            {["B", "I", "N", "G", "O"].map((l) => <span key={l}>{l}</span>)}
                          </div>
                          <div className="flex-1 grid grid-cols-5 grid-rows-5 border-t-[1pt] border-slate-900 bg-white">
                            {["B", "I", "N", "G", "O"].map((col, cIdx) =>
                              [0, 1, 2, 3, 4].map((row) => {
                                const isFree = row === 2 && cIdx === 2;
                                return (
                                  <div key={`${col}-${row}`} className="flex items-center justify-center border-[0.5pt] border-slate-200 text-[18pt] font-bold text-slate-900">
                                    {isFree ? (
                                      <div className="border-[2pt] rounded-full w-[85%] h-[85%] flex items-center justify-center text-[8pt] font-black -rotate-12 uppercase text-center px-1"
                                        style={{ borderColor: "var(--pg-primary)", color: "var(--pg-primary)" }}>
                                        {freeText}
                                      </div>
                                    ) : card.data[col][row]}
                                  </div>
                                );
                              })
                            )}
                          </div>
                          <div className="flex justify-between p-3 border-t-[1pt] border-slate-900 text-[9pt] font-bold text-slate-500 bg-slate-50">
                            <span>ID: <b className="text-slate-900">#{card.id}</b></span>
                            <span className="uppercase">{gameName} | A4</span>
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
        @media print {
          body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .page-print { margin: 0 !important; page-break-after: always; }
        }
      `}</style>
    </div>
  );
}
