import { motion } from 'framer-motion'
import { glassware, type Glassware } from '../data/glassware'
import { GlassSVG } from './GlassSVG'

type Props = {
  onSelect: (glass: Glassware) => void
}

export function GlassSelector({ onSelect }: Props) {
  return (
    <main className="min-h-svh bg-[image:var(--room-bg)] px-5 py-6 text-[color:var(--ink)]">
      <div className="mx-auto flex min-h-[calc(100svh-48px)] max-w-5xl flex-col justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-[color:var(--muted)]">Glassware bank</p>
          <h1 className="font-recipe mt-2 text-5xl leading-none sm:text-7xl">Pick the pour</h1>
        </div>
        <div className="scrollbar-none -mx-5 flex snap-x gap-4 overflow-x-auto px-5 py-7 sm:grid sm:grid-cols-4 sm:overflow-visible">
          {glassware.map((glass, index) => (
            <motion.button
              key={glass.id}
              type="button"
              className="min-w-[170px] snap-center rounded-[8px] border border-[color:var(--panel-border)] bg-[color:var(--panel)] p-4 text-center shadow-lg backdrop-blur-md"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              onClick={() => onSelect(glass)}
            >
              <div className="mx-auto flex h-28 items-end justify-center">
                <GlassSVG id={glass.id} compact />
              </div>
              <h2 className="mt-3 text-base font-bold">{glass.name}</h2>
              <p className="mt-1 text-xs text-[color:var(--muted)]">{glass.note}</p>
            </motion.button>
          ))}
        </div>
      </div>
    </main>
  )
}
