import { motion } from "motion/react";

export default function PokeballMark({ spin = false, className = "" }) {
  return (
    <motion.span
      className={`relative block h-24 w-24 rounded-full border-[8px] border-dex-dark bg-[linear-gradient(#d92f34_0_47%,#151927_47%_56%,white_56%)] ${className}`}
      animate={spin ? { rotate: 360 } : { rotate: 0 }}
      transition={spin ? { duration: 0.9, repeat: Infinity, ease: "linear" } : { duration: 0.25 }}
    >
      <span className="absolute left-1/2 top-1/2 block h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border-[6px] border-dex-dark bg-white" />
    </motion.span>
  );
}
