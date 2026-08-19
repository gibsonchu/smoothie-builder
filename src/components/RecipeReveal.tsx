import { RotateCcw } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import type { Ingredient } from '../data/ingredients'
import type { Recipe } from '../lib/openai'

type Props = {
  recipe: Recipe | null
  ingredients: Ingredient[]
  onReset: () => void
}

function TypeLine({ text, visible, className = '' }: { text: string; visible: number; className?: string }) {
  return <span className={className}>{text.slice(0, Math.max(0, visible))}</span>
}

export function RecipeReveal({ recipe, ingredients, onReset }: Props) {
  const reducedMotion = useReducedMotion()
  const [visible, setVisible] = useState(0)

  const blocks = useMemo(() => {
    if (!recipe) return []
    return [
      recipe.name,
      recipe.serves,
      `${recipe.calories} calories`,
      `${recipe.nutrition.protein} protein / ${recipe.nutrition.carbs} carbs / ${recipe.nutrition.fat} fat / ${recipe.nutrition.fiber} fiber`,
      ...recipe.ingredients.map((item) => `${item.amount} ${item.item}`),
      ...recipe.steps,
      recipe.grandmasNote,
    ]
  }, [recipe])

  const offsets = useMemo(() => {
    let cursor = 0
    return blocks.map((block) => {
      const start = cursor
      cursor += block.length + 4
      return start
    })
  }, [blocks])

  const total = blocks.reduce((sum, block) => sum + block.length + 4, 0)

  useEffect(() => {
    setVisible(0)
    if (!recipe) return
    if (reducedMotion) {
      setVisible(total)
      return
    }
    const timer = window.setInterval(() => {
      setVisible((current) => {
        if (current >= total) {
          window.clearInterval(timer)
          return total
        }
        return Math.min(total, current + 3)
      })
    }, 16)
    return () => window.clearInterval(timer)
  }, [recipe, reducedMotion, total])

  if (!recipe) {
    return (
      <section className="recipe-loading" role="status">
        <p>RECIPE CARD / IN PROGRESS</p>
        <h1>Writing something<br />for you<span className="typing-cursor">_</span></h1>
        <div className="loading-ingredients">{ingredients.map((item) => item.name).join(' / ')}</div>
      </section>
    )
  }

  let blockIndex = 0
  const line = (text: string, className?: string) => {
    const index = blockIndex
    blockIndex += 1
    return <TypeLine text={text} visible={visible - offsets[index]} className={className} />
  }

  return (
    <article className="recipe-page">
      <header className="recipe-header">
        <span>RECIPE / {new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit' }).toUpperCase()}</span>
        <span>MADE FROM WHAT WAS HERE</span>
      </header>

      <div className="recipe-grid">
        <section className="recipe-title">
          <p className="zine-kicker">A small recipe for today</p>
          <h1>{line(recipe.name)}</h1>
          <p className="recipe-serves">{line(recipe.serves)}</p>
        </section>

        <section className="nutrition-strip" aria-label="Estimated nutrition">
          <div><strong>{line(`${recipe.calories}`)}</strong><span>CALORIES</span></div>
          <p>{line(`${recipe.nutrition.protein} protein / ${recipe.nutrition.carbs} carbs / ${recipe.nutrition.fat} fat / ${recipe.nutrition.fiber} fiber`)}</p>
        </section>

        <section className="recipe-section recipe-ingredients">
          <h2>WHAT YOU'LL NEED</h2>
          <ul>
            {recipe.ingredients.map((item) => <li key={`${item.item}-${item.amount}`}>{line(`${item.amount} ${item.item}`)}</li>)}
          </ul>
        </section>

        <section className="recipe-section recipe-method">
          <h2>HOW TO MAKE IT</h2>
          <ol>
            {recipe.steps.map((step, index) => (
              <li key={step}><span>{String(index + 1).padStart(2, '0')}</span><p>{line(step)}</p></li>
            ))}
          </ol>
        </section>

        <aside className="grandma-note">
          <span>GRANDMA'S NOTE</span>
          <p>{line(recipe.grandmasNote)}</p>
        </aside>
      </div>

      <footer className="recipe-footer">
        <span>ESTIMATES ONLY / TASTE AS YOU GO</span>
        <button type="button" className="zine-button zine-button--ink" onClick={onReset}>
          <RotateCcw size={17} /> Make another
        </button>
      </footer>
    </article>
  )
}
