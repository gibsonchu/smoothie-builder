import type { Ingredient } from '../data/ingredients'
import { IngredientTile } from './IngredientTile'

type Props = {
  ingredients: Ingredient[]
}

export function IngredientShelf({ ingredients }: Props) {
  return (
    <aside className="rounded-t-[8px] border-t border-[color:var(--panel-border)] bg-[color:var(--panel)] p-3 shadow-2xl backdrop-blur-md lg:h-full lg:w-64 lg:rounded-[8px] lg:border">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-[color:var(--muted)]">Ingredients</h2>
        <span className="rounded-full bg-black/10 px-2 py-1 text-[11px] font-bold text-[color:var(--ink)]">{ingredients.length}</span>
      </div>
      <div className="scrollbar-none grid max-h-[178px] grid-flow-col grid-rows-2 gap-3 overflow-x-auto pb-2 lg:max-h-none lg:grid-flow-row lg:grid-cols-2 lg:overflow-visible">
        {ingredients.map((ingredient) => (
          <IngredientTile key={ingredient.id} ingredient={ingredient} />
        ))}
      </div>
    </aside>
  )
}
