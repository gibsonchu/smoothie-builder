import { ArrowLeft, Check, RotateCcw, Search, X } from 'lucide-react'
import { useDeferredValue, useMemo, useState } from 'react'
import type { Ingredient } from '../data/ingredients'

type Props = {
  catalog: Ingredient[]
  initialSelected: Ingredient[]
  image?: string | null
  note?: string | null
  onBack: () => void
  onRetake?: () => void
  onConfirm: (ingredients: Ingredient[]) => void
}

export function IngredientEditor({ catalog, initialSelected, image, note, onBack, onRetake, onConfirm }: Props) {
  const [selectedIds, setSelectedIds] = useState(() => new Set(initialSelected.map((item) => item.id)))
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query.trim().toLowerCase())

  const filtered = useMemo(
    () => catalog.filter((item) => !deferredQuery || item.name.toLowerCase().includes(deferredQuery)),
    [catalog, deferredQuery],
  )

  const selected = useMemo(
    () => catalog.filter((item) => selectedIds.has(item.id)),
    [catalog, selectedIds],
  )

  const toggle = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <section className="editor-page">
      <header className="editor-header">
        <button type="button" className="icon-button" onClick={onBack} aria-label="Go back" title="Go back">
          <ArrowLeft size={19} />
        </button>
        <p>{image ? 'PHOTO STUDY / IDENTIFIED' : 'PANTRY INDEX / SELECT'}</p>
        <span>{String(selected.length).padStart(2, '0')} CHOSEN</span>
      </header>

      <div className="editor-shell">
        {image ? (
          <figure className="photo-specimen">
            <img src={image} alt="Ingredients ready for review" />
            <figcaption>
              <span>{note ?? 'Review what we found, then add or remove anything.'}</span>
              {onRetake ? (
                <button type="button" className="text-button" onClick={onRetake}>
                  <RotateCcw size={14} /> Retake photo
                </button>
              ) : null}
            </figcaption>
          </figure>
        ) : (
          <div className="editor-title-block">
            <p className="zine-kicker">Choose what is within reach</p>
            <h1>What do you have?</h1>
          </div>
        )}

        <div className="ingredient-search">
          <Search size={19} aria-hidden="true" />
          <label className="sr-only" htmlFor="ingredient-query">Search ingredients</label>
          <input
            id="ingredient-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Type an ingredient..."
            autoComplete="off"
          />
          {query ? (
            <button type="button" onClick={() => setQuery('')} aria-label="Clear search" title="Clear search">
              <X size={17} />
            </button>
          ) : null}
        </div>

        <div className="ingredient-list-heading">
          <span>INGREDIENT</span>
          <span>{deferredQuery ? `${filtered.length} MATCHES` : 'TAP TO SELECT'}</span>
        </div>

        <div className="ingredient-ledger" aria-label="Available ingredients">
          {filtered.map((item, index) => {
            const isSelected = selectedIds.has(item.id)
            return (
              <button
                type="button"
                key={item.id}
                className={`ingredient-row${isSelected ? ' ingredient-row--selected' : ''}`}
                onClick={() => toggle(item.id)}
                aria-pressed={isSelected}
              >
                <span className="ingredient-number">{String(index + 1).padStart(2, '0')}</span>
                <span className="ingredient-name">{item.name}</span>
                <span className="ingredient-state">{isSelected ? <Check size={16} /> : 'ADD'}</span>
              </button>
            )
          })}
          {!filtered.length ? <p className="empty-ledger">No match. Try another word.</p> : null}
        </div>

        <footer className="editor-actions">
          <div>
            <strong>{selected.length}</strong>
            <span>ingredients selected</span>
          </div>
          <button type="button" className="text-button" onClick={() => setSelectedIds(new Set())} disabled={!selected.length}>
            Clear list
          </button>
          <button
            type="button"
            className="zine-button zine-button--accent confirm-button"
            disabled={!selected.length}
            onClick={() => onConfirm(selected)}
          >
            Confirm <Check size={17} />
          </button>
        </footer>
      </div>
    </section>
  )
}
