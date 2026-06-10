import { motion } from 'framer-motion'

type Props = {
  active: boolean
  color: string
}

export function PourAnimation({ active, color }: Props) {
  if (!active) return null

  return (
    <motion.svg
      viewBox="0 0 220 160"
      className="pointer-events-none absolute left-1/2 top-[45%] z-20 h-40 w-56 -translate-x-1/2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      aria-hidden="true"
    >
      <motion.path
        d="M72 18 C106 48, 132 78, 154 135"
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.4, ease: 'easeInOut' }}
      />
      <motion.circle cx="154" cy="135" r="8" fill={color} animate={{ y: [0, 10, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.55, repeat: Infinity }} />
    </motion.svg>
  )
}
