import { useDroppable } from '@dnd-kit/core'
import { AnimatePresence, motion } from 'framer-motion'
import type { Ingredient } from '../data/ingredients'

type Props = {
  ingredients: Ingredient[]
  blendedColor: string
  isBlending: boolean
  isPouring: boolean
  canBlend: boolean
  onBlend: () => void
}

export function BlenderDropZone({ ingredients, blendedColor, isBlending, isPouring, canBlend, onBlend }: Props) {
  const { isOver, setNodeRef } = useDroppable({ id: 'blender' })

  return (
    <div ref={setNodeRef} className="relative flex min-h-[260px] flex-1 items-center justify-center sm:min-h-[330px]">
      <motion.div
        className="relative"
        animate={isPouring ? { rotate: -18, x: -24, y: 6 } : { rotate: 0, x: 0, y: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 16 }}
      >
        <svg viewBox="0 0 220 300" className="h-[240px] w-[176px] drop-shadow-2xl sm:h-[300px] sm:w-[220px]" aria-label="Blender drop zone">
          <motion.path
            d="M63 74h94l-15 134H78z"
            fill="rgba(255,255,255,.18)"
            stroke={isOver ? 'var(--accent-strong)' : 'var(--glass-line)'}
            strokeWidth="5"
            animate={isOver ? { filter: 'drop-shadow(0 0 18px var(--accent-strong))' } : {}}
          />
          <path d="M76 53h68l13 21H63z" fill="#d8dde0" stroke="rgba(0,0,0,.24)" strokeWidth="4" />
          <motion.g
            animate={isBlending ? { rotate: [0, 18, -18, 0], scale: [1, 1.04, 0.98, 1] } : {}}
            transition={{ duration: 0.36, repeat: isBlending ? Infinity : 0 }}
            style={{ transformOrigin: '110px 143px' }}
          >
            <AnimatePresence>
              {ingredients.map((ingredient, index) => (
                <motion.text
                  key={`${ingredient.id}-${index}`}
                  x={86 + (index % 4) * 16}
                  y={186 - Math.floor(index / 4) * 24}
                  fontSize="20"
                  initial={{ y: 25, opacity: 0, scale: 1.6 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {ingredient.icon}
                </motion.text>
              ))}
            </AnimatePresence>
            {isBlending && <motion.circle cx="110" cy="146" r="48" fill={blendedColor} opacity=".38" />}
          </motion.g>
          <path d="M78 208h64l18 54H60z" fill="#d8dde0" stroke="rgba(0,0,0,.28)" strokeWidth="4" />
          <path d="M55 263h110" stroke="rgba(0,0,0,.3)" strokeWidth="10" strokeLinecap="round" />
          <path d="M158 113h18c10 0 16 8 16 18v32" fill="none" stroke="var(--glass-line)" strokeWidth="5" strokeLinecap="round" />
          <circle cx="111" cy="236" r="13" fill="var(--button-face)" stroke="rgba(0,0,0,.3)" strokeWidth="3" />
        </svg>
      </motion.div>
      <motion.button
        type="button"
        disabled={!canBlend || isBlending || isPouring}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-[8px] border border-black/20 bg-[color:var(--button-face)] px-7 py-3 text-sm font-black uppercase tracking-[0.22em] text-[color:var(--ink)] shadow-[0_7px_0_var(--button-shadow)] disabled:pointer-events-none disabled:opacity-0"
        animate={canBlend ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
        onClick={onBlend}
      >
        Blend
      </motion.button>
    </div>
  )
}
