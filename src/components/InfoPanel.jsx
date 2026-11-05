import { m } from "motion/react";

export function InfoPanel({ title, children }) {
  return (
    <m.div
      className="rounded-lg border-2 border-emerald-950/20 bg-white/45 p-4 shadow-[inset_0_-4px_0_rgba(20,32,51,0.06)]"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
    >
      <h3 className="mb-4 font-pixel text-xl font-black uppercase leading-6 text-dex-ink sm:text-2xl">{title}</h3>
      {children}
    </m.div>
  );
}

export function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-b-2 border-emerald-950/10 py-2 last:border-b-0">
      <span className="font-pixel text-lg font-black uppercase text-emerald-950/60">{label}</span>
      <strong className="text-right font-display text-base leading-5 text-dex-ink">{value}</strong>
    </div>
  );
}

export function PanelNote({ children }) {
  return <p className="font-display text-base leading-6 text-emerald-950/60">{children}</p>;
}
