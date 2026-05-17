"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Atom,
  Box,
  Calculator,
  GraduationCap,
  Info,
  Maximize,
  Minimize,
  MousePointer2,
  Orbit,
  RotateCcw,
  Ruler,
  Shapes,
  Sparkles,
} from "lucide-react";
import dynamic from "next/dynamic";
import { BlockMath } from "react-katex";
import { FIGURES, FigureId, Parameters, calculateFigure, defaultParams } from "@/lib/figures";

const GeometryScene = dynamic(() => import("@/components/geometry-scene").then((m) => m.GeometryScene), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center text-sky-100/70">Завантаження 3D-сцени...</div>,
});

const format = (value: number) => new Intl.NumberFormat("uk-UA", { maximumFractionDigits: 2 }).format(value);

export default function Home() {
  const sceneRef = useRef<HTMLElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeId, setActiveId] = useState<FigureId>("cube");
  const [params, setParams] = useState<Record<FigureId, Parameters>>(() =>
    Object.fromEntries(FIGURES.map((figure) => [figure.id, defaultParams(figure.id)])) as Record<FigureId, Parameters>,
  );
  const [realLife, setRealLife] = useState(false);
  const [controlMode, setControlMode] = useState<"camera" | "figure">("camera");

  const toggleFullscreen = useCallback(() => {
    if (!sceneRef.current) return;
    if (!document.fullscreenElement) {
      sceneRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "f" || e.key === "F" || e.key === "\u0430" || e.key === "\u0410") {
        toggleFullscreen();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [toggleFullscreen]);
  const active = FIGURES.find((figure) => figure.id === activeId) ?? FIGURES[0];
  const currentParams = params[activeId];
  const result = useMemo(() => calculateFigure(activeId, currentParams), [activeId, currentParams]);

  const updateParam = (key: string, value: number) => {
    setParams((previous) => ({ ...previous, [activeId]: { ...previous[activeId], [key]: value } }));
  };

  return (
    <main className="min-h-screen px-4 py-4 text-slate-50 sm:px-6 lg:px-8">
      <header className="mx-auto flex max-w-[1500px] items-center justify-between rounded-3xl px-5 py-4 glass">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-200 shadow-glow">
            <Shapes aria-hidden />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-normal sm:text-2xl">3D Геометрія</h1>
            <p className="text-sm text-slate-300">Інтерактивна платформа для уроків математики</p>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 md:flex">
          <MousePointer2 aria-hidden className="size-4" />
          Обертай, масштабуй, досліджуй
        </div>
      </header>

      <section className="mx-auto mt-5 grid max-w-[1500px] gap-5 lg:grid-cols-[260px_minmax(0,1fr)_360px]">
        <aside className="glass rounded-3xl p-4">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-cyan-100">
            <Atom aria-hidden className="size-4" />
            Фігури
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {FIGURES.map((figure) => {
              const selected = figure.id === activeId;
              return (
                <button
                  key={figure.id}
                  type="button"
                  onClick={() => setActiveId(figure.id)}
                  className={`group flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                    selected
                      ? "border-cyan-300/60 bg-cyan-300/15 text-white shadow-glow"
                      : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/25 hover:bg-white/[0.08]"
                  }`}
                >
                  <span>
                    <span className="block font-semibold">{figure.name}</span>
                    <span className="text-xs text-slate-400">{figure.realObject}</span>
                  </span>
                  <Box aria-hidden className={`size-4 transition ${selected ? "text-orange-300" : "text-slate-500 group-hover:text-cyan-200"}`} />
                </button>
              );
            })}
          </div>
        </aside>

        <section ref={sceneRef} className={`glass relative overflow-hidden rounded-3xl ${isFullscreen ? "min-h-screen bg-[#07111f]" : "min-h-[520px]"}`}>
          <div className="absolute left-5 top-5 z-10 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-cyan-200/20 bg-cyan-300/10 px-3 py-1 text-sm text-cyan-100">{active.name}</span>
            <button
              type="button"
              onClick={() => setControlMode("camera")}
              className={`rounded-full border px-3 py-1 text-sm transition ${
                controlMode === "camera"
                  ? "border-cyan-300/60 bg-cyan-300/20 text-white shadow-glow"
                  : "border-white/10 bg-white/5 text-slate-400 hover:border-white/25 hover:text-slate-200"
              }`}
            >
              <Orbit aria-hidden className="mr-1 inline size-4" />
              Керування камерою
            </button>
            <button
              type="button"
              onClick={() => setControlMode("figure")}
              className={`rounded-full border px-3 py-1 text-sm transition ${
                controlMode === "figure"
                  ? "border-cyan-300/60 bg-cyan-300/20 text-white shadow-glow"
                  : "border-white/10 bg-white/5 text-slate-400 hover:border-white/25 hover:text-slate-200"
              }`}
            >
              <RotateCcw aria-hidden className="mr-1 inline size-4" />
              Керування фігурою
            </button>
          </div>
          <button
            type="button"
            onClick={toggleFullscreen}
            className="absolute right-5 top-5 z-10 flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:border-white/25 hover:bg-white/10 hover:text-slate-200"
            title={isFullscreen ? "Вийти (F / Esc)" : "Повноекранний режим (F)"}
          >
            {isFullscreen ? <Minimize aria-hidden className="size-4" /> : <Maximize aria-hidden className="size-4" />}
          </button>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeId}-${realLife}`}
              className={isFullscreen ? "h-screen" : "h-[520px] md:h-[640px]"}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.32 }}
            >
              <Suspense fallback={null}>
                <GeometryScene figureId={activeId} params={currentParams} realLife={realLife} controlMode={controlMode} />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </section>

        <aside className="glass rounded-3xl p-5">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold">{active.name}</h2>
              <p className="text-sm text-slate-300">{active.definition}</p>
            </div>
            <Calculator aria-hidden className="size-6 text-orange-300" />
          </div>

          <label className="mb-5 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-3">
            <span className="text-sm font-semibold">Показати приклад із реального життя</span>
            <button
              type="button"
              role="switch"
              aria-checked={realLife}
              onClick={() => setRealLife(!realLife)}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                realLife ? "bg-orange-400" : "bg-slate-600"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
                  realLife ? "translate-x-[26px]" : "translate-x-[2px]"
                }`}
              />
            </button>
          </label>

          <div className="flex flex-col gap-4">
            {active.controls.map((control) => (
              <div key={control.key} className="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="font-semibold">{control.label}</span>
                  <span className="rounded-full bg-cyan-300/10 px-2 py-1 text-sm text-cyan-100">{currentParams[control.key]} см</span>
                </div>
                <input
                  className="range w-full"
                  type="range"
                  min={control.min}
                  max={control.max}
                  step={control.step}
                  value={currentParams[control.key]}
                  onChange={(event) => updateParam(control.key, Number(event.target.value))}
                  aria-label={control.label}
                />
                <p className="mt-2 flex gap-2 text-xs text-slate-400">
                  <Info aria-hidden className="mt-0.5 size-3.5 shrink-0" />
                  {control.hint}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3">
            <Formula title="Об'єм" latex={active.volumeFormula} value={`${format(result.volume)} см^3`} />
            <Formula title="Площа поверхні" latex={active.surfaceFormula} value={`${format(result.surfaceArea)} см^2`} />
          </div>
        </aside>
      </section>

      <section className="mx-auto mt-5 grid max-w-[1500px] gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="glass rounded-3xl p-5">
          <div className="mb-3 flex items-center gap-2 text-lg font-bold">
            <Sparkles aria-hidden className="size-5 text-cyan-200" />
            У реальному житті
          </div>
          <p className="text-slate-300">{active.lifeExplanation}</p>
        </div>
        <div className="glass rounded-3xl p-5">
          <div className="mb-3 flex items-center gap-2 text-lg font-bold">
            <GraduationCap aria-hidden className="size-5 text-orange-300" />
            Міні-завдання
          </div>
          <p className="text-slate-300">{active.task}</p>
          <p className="mt-3 flex gap-2 text-sm text-cyan-100">
            <Ruler aria-hidden className="mt-0.5 size-4 shrink-0" />
            {active.effectExplanation}
          </p>
        </div>
      </section>

      <footer className="mx-auto mt-5 max-w-[1500px] rounded-3xl px-5 py-5 glass">
        <div className="flex flex-col gap-3 text-sm text-slate-300 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <GraduationCap aria-hidden className="size-5 text-cyan-200" />
            <span>Проєкт створили студенти групи ІПЗ-11: Лисак Максим та Ніколайчук Максим</span>
          </div>
          <span>ВСП «Оптико-механічний фаховий коледж КНУ імені Тараса Шевченка»</span>
        </div>
      </footer>
    </main>
  );
}

function Formula({ title, latex, value }: { title: string; latex: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-slate-300">{title}</span>
        <span className="rounded-full bg-orange-400/15 px-2 py-1 text-sm font-bold text-orange-100">{value}</span>
      </div>
      <BlockMath math={latex} />
    </div>
  );
}
