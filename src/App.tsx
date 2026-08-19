import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useState } from 'react'
import { IngredientEditor } from './components/IngredientEditor'
import { PhotoCapture } from './components/PhotoCapture'
import { RecipeReveal } from './components/RecipeReveal'
import { ZineLanding } from './components/ZineLanding'
import { ingredients, type Ingredient } from './data/ingredients'
import { fallbackRecipe, generateRecipe, type Recipe } from './lib/openai'

type View = 'landing' | 'choose' | 'photo' | 'photo-review' | 'recipe'

function App() {
  const [view, setView] = useState<View>('landing')
  const [selected, setSelected] = useState<Ingredient[]>([])
  const [photo, setPhoto] = useState<string | null>(null)
  const [photoMessage, setPhotoMessage] = useState<string | null>(null)
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const reducedMotion = useReducedMotion()

  const openChoose = () => {
    setSelected([])
    setPhoto(null)
    setPhotoMessage(null)
    setView('choose')
  }

  const openPhoto = () => {
    setSelected([])
    setPhoto(null)
    setPhotoMessage(null)
    setView('photo')
  }

  const makeRecipe = async (confirmed: Ingredient[]) => {
    if (!confirmed.length) return
    setSelected(confirmed)
    setRecipe(null)
    setView('recipe')
    const nextRecipe = await generateRecipe(confirmed).catch(() => fallbackRecipe(confirmed))
    setRecipe(nextRecipe)
  }

  const reset = () => {
    setSelected([])
    setPhoto(null)
    setPhotoMessage(null)
    setRecipe(null)
    setView('landing')
  }

  return (
    <main className="zine-app">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={view}
          className="zine-view"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.42, ease: 'easeOut' }}
        >
          {view === 'landing' ? <ZineLanding onPhoto={openPhoto} onChoose={openChoose} /> : null}

          {view === 'choose' ? (
            <IngredientEditor
              catalog={ingredients}
              initialSelected={selected}
              onBack={() => setView('landing')}
              onConfirm={makeRecipe}
            />
          ) : null}

          {view === 'photo' ? (
            <PhotoCapture
              catalog={ingredients}
              onDetected={({ preview, detected, message }) => {
                setPhoto(preview)
                setSelected(detected)
                setPhotoMessage(message)
                setView('photo-review')
              }}
            />
          ) : null}

          {view === 'photo-review' ? (
            <IngredientEditor
              catalog={ingredients}
              initialSelected={selected}
              image={photo}
              note={photoMessage}
              onBack={() => setView('landing')}
              onRetake={openPhoto}
              onConfirm={makeRecipe}
            />
          ) : null}

          {view === 'recipe' ? (
            <RecipeReveal recipe={recipe} ingredients={selected} onReset={reset} />
          ) : null}
        </motion.div>
      </AnimatePresence>
    </main>
  )
}

export default App
