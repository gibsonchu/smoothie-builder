import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { Ingredient } from '../data/ingredients'

type Props = {
  ingredient: Ingredient
}

export function IngredientTile({ ingredient }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: ingredient.id,
    data: ingredient,
  })

  return (
    <button
      ref={setNodeRef}
      type="button"
      className="touch-none select-none rounded-[8px] border-2 border-dashed border-[#2b241f]/35 bg-[#fff8e9] px-3 py-2 text-left shadow-[0_6px_0_rgba(0,0,0,0.14)] transition-opacity"
      style={{
        transform: CSS.Translate.toString(transform) ?? `rotate(${ingredient.rotation}deg)`,
        opacity: isDragging ? 0.35 : 1,
      }}
      {...listeners}
      {...attributes}
    >
      <span className="block text-2xl leading-none">{ingredient.icon}</span>
      <span className="mt-1 block max-w-[84px] truncate text-[11px] font-bold text-[#3b332d]">{ingredient.name}</span>
    </button>
  )
}
