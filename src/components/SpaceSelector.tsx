import { motion } from 'framer-motion'
import { spaces, type Space } from '../data/spaces'

type Props = {
  onSelect: (space: Space) => void
}

export function SpaceSelector({ onSelect }: Props) {
  return (
    <main className="min-h-svh bg-[#efe8d9] text-[#211b17]">
      <div className="mx-auto flex min-h-svh w-full max-w-6xl flex-col px-5 py-6 sm:px-8">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#7f715d]">Smoothie Builder</p>
            <h1 className="font-recipe mt-2 text-5xl leading-none sm:text-7xl">Choose your kitchen</h1>
          </div>
          <div className="hidden h-16 w-16 rounded-full border border-[#b5a387] bg-[#f8f0de] shadow-inner sm:block" />
        </div>

        <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {spaces.map((space, index) => (
            <motion.button
              key={space.id}
              type="button"
              className={`${space.className} relative min-h-[178px] overflow-hidden rounded-[8px] border border-black/10 p-5 text-left shadow-xl`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(space)}
            >
              <div className="absolute inset-0 bg-[image:var(--room-bg)]" />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-[image:var(--surface-texture)]" />
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex gap-2">
                  {space.palette.map((color) => (
                    <span
                      key={color}
                      className="h-5 w-5 rounded-full border border-white/45 shadow"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="rounded-[8px] border border-[color:var(--panel-border)] bg-[color:var(--panel)] p-4 backdrop-blur-sm">
                  <h2 className="font-recipe text-[34px] leading-none text-[color:var(--ink)]">{space.label}</h2>
                  <p className="mt-2 text-sm font-medium text-[color:var(--muted)]">{space.vibe}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </main>
  )
}
