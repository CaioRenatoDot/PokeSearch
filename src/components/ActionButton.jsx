import { m } from "motion/react";
import Icon from "./Icon.jsx";

export default function ActionButton({ icon, iconFilled = false, isActive = false, disabled = false, children, ...props }) {
  return (
    <m.button
      className={`inline-flex items-center justify-center gap-2 rounded border-2 px-3 py-2 font-pixel text-base font-black uppercase leading-5 text-dex-ink shadow-[inset_0_-3px_0_rgba(20,32,51,0.08)] transition disabled:cursor-not-allowed disabled:opacity-40 ${
        isActive ? "border-dex-dark bg-amber-300" : "border-emerald-950/25 bg-white/60 hover:bg-white/85"
      }`}
      type="button"
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      {...props}
    >
      {icon ? <Icon name={icon} size={16} strokeWidth={3} filled={iconFilled} /> : null}
      {children}
    </m.button>
  );
}
