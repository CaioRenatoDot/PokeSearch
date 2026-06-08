import { motion } from "motion/react";
import Icon from "./Icon.jsx";

export default function FactCard({ icon, label, value }) {
  return (
    <motion.div
      className="min-h-24 rounded-lg border border-emerald-950/15 bg-white/60 p-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      whileHover={{ y: -3, backgroundColor: "rgba(255, 255, 255, 0.74)" }}
    >
      <div className="mb-3 flex items-center gap-2 font-pixel text-base font-black uppercase leading-5 text-emerald-950/60">
        <Icon name={icon} size={17} />
        {label}
      </div>
      <strong className="block break-words text-2xl font-black leading-7 text-dex-ink">{value}</strong>
    </motion.div>
  );
}
