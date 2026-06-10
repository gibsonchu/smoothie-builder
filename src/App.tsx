import { closestCenter, DndContext, DragOverlay, MouseSensor, TouchSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { BlenderDropZone } from './components/BlenderDropZone'
import { GlassSelector } from './components/GlassSelector'
import { GlassSVG } from './components/GlassSVG'
import { IngredientShelf } from './components/IngredientShelf'
import { PourAnimation } from './components/PourAnimation'
import { RecipeCard } from './components/RecipeCard'
import { SpaceSelector } from './components/SpaceSelector'
import { glassware, type Glassware } from './data/glassware'
import { ingredients, type Ingredient } from './data/ingredients'
import { spaces, type Space } from './data/spaces'
import { averageColor } from './lib/color'
import { fallbackRecipe, generateRecipe, type Recipe } from './lib/openai'

type Phase = 'space' | 'glass' | 'build'

function App() {
  const [phase, setPhase] = useState<Phase>('space')
  const [space, setSpace] = useState<Space>(spaces[0])
  const [glass, setGlass] = useState<Glassware>(glassware[0])
  const [selected, setSelected] = useState<Ingredient[]>([])
  const [activeIngredient, setActiveIngredient] = useState<Ingredient | null>(null)
  const [isBlending, setIsBlending] = useState(false)
  const [isPouring, setIsPouring] = useState(false)
  const [fill, setFill] = useState(0)
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 8 } }),
  )
  const blendedColor = useMemo(() => averageColor(selected), [selected])
  const canBlend = selected.length >= 2 && !isBlending && !isPouring && !recipe

  const handleDragStart = (event: DragStartEvent) => {
    setActiveIngredient(event.active.data.current as Ingredient)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const dropped = event.active.data.current as Ingredient | undefined
    if (event.over?.id === 'blender' && dropped) {
      setSelected((items) => [...items, dropped])
    }
    setActiveIngredient(null)
  }

  const handleBlend = async () => {
    if (!canBlend) return
    setIsBlending(true)
    const recipePromise = generateRecipe(selected)
    const blendTime = prefersReducedMotion ? 120 : 2000
    const pourTime = prefersReducedMotion ? 120 : 1500

    window.setTimeout(() => {
      setIsBlending(false)
      setIsPouring(true)
      setFill(100)
    }, blendTime)

    window.setTimeout(async () => {
      setIsPouring(false)
      setRecipe(await recipePromise.catch(() => fallbackRecipe(selected)))
    }, blendTime + pourTime)
  }

  const reset = () => {
    setSelected([])
    setActiveIngredient(null)
    setIsBlending(false)
    setIsPouring(false)
    setFill(0)
    setRecipe(null)
  }

  if (phase === 'space') {
    return (
      <SpaceSelector
        onSelect={(nextSpace) => {
          setSpace(nextSpace)
          setPhase('glass')
        }}
      />
    )
  }

  if (phase === 'glass') {
    return (
      <div className={space.className}>
        <GlassSelector
          onSelect={(nextGlass) => {
            setGlass(nextGlass)
            setPhase('build')
          }}
        />
      </div>
    )
  }

  return (
    <div className={`${space.className} min-h-svh overflow-hidden bg-[image:var(--room-bg)] text-[color:var(--ink)]`}>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <main className="flex min-h-svh flex-col">
          <header className="flex items-center justify-between gap-3 px-4 py-4 sm:px-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--muted)]">{space.shortLabel}</p>
              <h1 className="font-recipe text-[36px] font-bold leading-none">Smoothie hour</h1>
            </div>
            <button type="button" className="rounded-[8px] border border-[color:var(--panel-border)] bg-[color:var(--panel)] px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] backdrop-blur" onClick={() => setPhase('glass')}>
              {glass.name}
            </button>
          </header>

          <section className="relative flex flex-1 flex-col gap-3 px-3 pb-0 lg:grid lg:grid-cols-[16rem_1fr] lg:px-6 lg:pb-6">
            <IngredientShelf ingredients={ingredients} />
            <div className="relative flex min-h-[calc(100svh-315px)] flex-1 flex-col overflow-hidden rounded-t-[8px] border border-[color:var(--panel-border)] bg-[color:var(--panel)] backdrop-blur-md lg:min-h-0 lg:rounded-[8px]">
              <div className="absolute inset-x-0 bottom-0 h-[34%] bg-[image:var(--surface-texture)] shadow-[0_-18px_45px_rgba(0,0,0,0.14)_inset]" />
              <PourAnimation active={isPouring} color={blendedColor} />
              <div className="relative z-10 flex flex-1 items-end justify-center gap-4 px-3 pb-9 pt-2 sm:gap-12">
                <BlenderDropZone ingredients={selected} blendedColor={blendedColor} isBlending={isBlending} isPouring={isPouring} canBlend={canBlend} onBlend={handleBlend} />
                <motion.div className="flex min-w-[126px] flex-col items-center justify-end" animate={{ scale: isPouring ? [1, 1.02, 1] : 1 }} transition={{ duration: 0.5, repeat: isPouring ? Infinity : 0 }}>
                  <GlassSVG id={glass.id} fill={fill} color={blendedColor} />
                  <div className="mt-[-8px] h-3 w-28 rounded-full bg-black/20 blur-sm" />
                </motion.div>
              </div>
              <div className="absolute left-4 top-4 z-20 rounded-[8px] border border-[color:var(--panel-border)] bg-[color:var(--panel)] px-3 py-2 text-sm font-bold shadow backdrop-blur">
                {selected.length} in blender
              </div>
            </div>
          </section>
        </main>

        <DragOverlay>
          {activeIngredient ? (
            <div className="rounded-[8px] border-2 border-dashed border-[#2b241f]/35 bg-[#fff8e9] px-4 py-3 shadow-xl">
              <span className="text-3xl">{activeIngredient.icon}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <AnimatePresence>
        {recipe && (
          <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', stiffness: 120, damping: 18 }}>
            <RecipeCard recipe={recipe} onReset={reset} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
