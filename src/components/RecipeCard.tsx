import html2canvas from 'html2canvas'
import { Download, RotateCcw } from 'lucide-react'
import { useRef } from 'react'
import type { Recipe } from '../lib/openai'

type Props = {
  recipe: Recipe
  onReset: () => void
}

export function RecipeCard({ recipe, onReset }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)

  const saveImage = async () => {
    if (!cardRef.current) return
    const canvas = await html2canvas(cardRef.current, { backgroundColor: null, scale: 2 })
    const link = document.createElement('a')
    link.download = `${recipe.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-end justify-center bg-black/20 p-3 backdrop-blur-sm sm:inset-0 sm:items-center">
      <div className="w-full max-w-[560px]">
        <div ref={cardRef} className="paper-noise relative rotate-[-1deg] rounded-[8px] border border-[#c8b58d] bg-[#fff8e8] px-6 py-7 text-[#4a3529] shadow-2xl sm:px-10">
          <div className="absolute right-5 top-4 text-4xl">🍓</div>
          <p className="font-recipe text-2xl text-[#8b6f4f]">from my recipe box</p>
          <h2 className="font-recipe mt-1 max-w-[88%] text-[44px] font-bold leading-[0.9] sm:text-[58px]">{recipe.name}</h2>
          <svg className="my-2 h-5 w-64 max-w-full" viewBox="0 0 260 20" aria-hidden="true">
            <path d="M4 12c39-12 68 8 104-1 39-10 79-9 148-1" fill="none" stroke="#c65a46" strokeWidth="4" strokeLinecap="round" />
          </svg>
          <p className="font-recipe text-2xl">{recipe.serves}</p>

          <div className="mt-5 grid gap-5 sm:grid-cols-[0.9fr_1.1fr]">
            <section>
              <h3 className="font-recipe text-3xl font-bold">What You'll Need</h3>
              <ul className="mt-2 space-y-1">
                {recipe.ingredients.map((item) => (
                  <li key={`${item.item}-${item.amount}`} className="font-recipe text-2xl leading-7">
                    {item.amount} {item.item}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="font-recipe text-3xl font-bold">How to Make It</h3>
              <ol className="mt-2 space-y-1">
                {recipe.steps.map((step, index) => (
                  <li key={step} className="font-recipe text-2xl leading-7">
                    {index + 1}. {step}
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <section className="mt-5 rounded-[8px] border border-[#dbc797] bg-white/35 p-3">
            <h3 className="font-recipe text-3xl font-bold">Grandma's Note</h3>
            <p className="font-recipe text-2xl leading-7">{recipe.grandmasNote}</p>
          </section>
        </div>
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={saveImage} className="flex flex-1 items-center justify-center gap-2 rounded-[8px] bg-[#2f2a24] px-4 py-3 text-sm font-bold text-white">
            <Download size={17} /> Save as Image
          </button>
          <button type="button" onClick={onReset} className="flex flex-1 items-center justify-center gap-2 rounded-[8px] bg-white px-4 py-3 text-sm font-bold text-[#2f2a24]">
            <RotateCcw size={17} /> Make Another
          </button>
        </div>
      </div>
    </div>
  )
}
