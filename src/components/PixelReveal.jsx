import { motion } from "motion/react";

const columns = 24;
const rows = 15;
const pixels = Array.from({ length: columns * rows }, (_, index) => {
  const row = Math.floor(index / columns);
  const column = index % columns;

  return {
    id: index,
    delay: column * 0.014 + row * 0.01
  };
});

export default function PixelReveal({ triggerKey }) {
  return (
    <motion.div
      key={triggerKey}
      className="pointer-events-none absolute inset-0 z-20 grid overflow-hidden bg-emerald-950/10"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 0.95, duration: 0.28, ease: "easeOut" }}
    >
      {pixels.map(pixel => (
        <motion.span
          key={pixel.id}
          className="block bg-[rgba(20,32,51,0.92)] shadow-[inset_0_0_0_1px_rgba(216,255,242,0.16)]"
          initial={{ opacity: 0, scale: 0.45 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0.45, 1, 1, 0.8]
          }}
          transition={{
            delay: pixel.delay,
            duration: 0.42,
            times: [0, 0.28, 0.72, 1],
            ease: "easeOut"
          }}
        />
      ))}
    </motion.div>
  );
}
