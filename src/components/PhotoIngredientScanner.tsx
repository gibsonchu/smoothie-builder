import { Camera, Check, Loader2, Sparkles, X } from 'lucide-react'
import { useMemo, useRef, useState, type ChangeEvent } from 'react'
import type { Ingredient } from '../data/ingredients'
import { identifyIngredientsFromPhoto, type DetectedIngredient } from '../lib/openai'

type Props = {
  ingredients: Ingredient[]
  onConfirm: (ingredients: Ingredient[]) => void
}

type ScanState = 'idle' | 'reading' | 'scanning' | 'review'

const fileToPreview = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('Could not read image'))
    reader.readAsDataURL(file)
  })

const resizeImage = (dataUrl: string) =>
  new Promise<string>((resolve) => {
    const image = new Image()
    image.onload = () => {
      const maxSize = 1200
      const scale = Math.min(1, maxSize / Math.max(image.width, image.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(image.width * scale)
      canvas.height = Math.round(image.height * scale)
      const context = canvas.getContext('2d')
      if (!context) {
        resolve(dataUrl)
        return
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', 0.82))
    }
    image.onerror = () => resolve(dataUrl)
    image.src = dataUrl
  })

export function PhotoIngredientScanner({ ingredients, onConfirm }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [scanState, setScanState] = useState<ScanState>('idle')
  const [preview, setPreview] = useState<string | null>(null)
  const [detected, setDetected] = useState<DetectedIngredient[]>([])
  const [confirmedIds, setConfirmedIds] = useState<Set<string>>(new Set())
  const [message, setMessage] = useState<string>('Point your camera at the produce, then confirm what I found.')

  const ingredientById = useMemo(() => new Map(ingredients.map((ingredient) => [ingredient.id, ingredient])), [ingredients])
  const confirmedIngredients = detected
    .filter((item) => confirmedIds.has(item.id))
    .map((item) => ingredientById.get(item.id))
    .filter((item): item is Ingredient => Boolean(item))

  const analyzePhoto = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    setScanState('reading')
    setDetected([])
    setConfirmedIds(new Set())
    setMessage('Getting the photo ready...')

    try {
      const rawPreview = await fileToPreview(file)
      setPreview(rawPreview)
      const imageDataUrl = await resizeImage(rawPreview)

      setScanState('scanning')
      setMessage('Looking over the counter...')
      const result = await identifyIngredientsFromPhoto(imageDataUrl)

      if (result.apiKeyMissing) {
        setScanState('review')
        setMessage('Add VITE_OPENAI_API_KEY to enable photo identification. Manual dragging still works.')
        return
      }

      const unique = result.ingredients.filter((item, index, list) => list.findIndex((candidate) => candidate.id === item.id) === index)
      setDetected(unique)
      setConfirmedIds(new Set(unique.map((item) => item.id)))
      setScanState('review')
      setMessage(unique.length ? 'Confirm the ingredients that look right.' : 'I could not confidently spot anything from the smoothie shelf.')
    } catch {
      setScanState('review')
      setMessage('That photo would not scan. Try another angle with the produce in good light.')
    }
  }

  const toggleDetected = (id: string) => {
    setConfirmedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const confirmScan = () => {
    if (!confirmedIngredients.length) return
    onConfirm(confirmedIngredients)
    setMessage(`${confirmedIngredients.length} ingredient${confirmedIngredients.length === 1 ? '' : 's'} added to the blender.`)
  }

  const resetScan = () => {
    setScanState('idle')
    setPreview(null)
    setDetected([])
    setConfirmedIds(new Set())
    setMessage('Point your camera at the produce, then confirm what I found.')
  }

  const isBusy = scanState === 'reading' || scanState === 'scanning'

  return (
    <section className="mb-3 rounded-[8px] border border-[color:var(--panel-border)] bg-white/35 p-3 shadow-inner">
      <input ref={inputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={analyzePhoto} />
      <div className="flex items-start gap-3">
        <button
          type="button"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] bg-[color:var(--button-face)] text-[color:var(--ink)] shadow-[0_4px_0_var(--button-shadow)] disabled:opacity-60"
          onClick={() => inputRef.current?.click()}
          disabled={isBusy}
          aria-label="Take or upload an ingredient photo"
          title="Take or upload an ingredient photo"
        >
          {isBusy ? <Loader2 className="animate-spin" size={20} /> : <Camera size={20} />}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Sparkles size={15} />
            <h3 className="text-sm font-black uppercase tracking-[0.14em]">Photo scan</h3>
          </div>
          <p className="mt-1 text-xs font-medium leading-4 text-[color:var(--muted)]">{message}</p>
        </div>
        {preview && (
          <button type="button" className="rounded-full bg-black/10 p-1" onClick={resetScan} aria-label="Clear photo scan" title="Clear photo scan">
            <X size={15} />
          </button>
        )}
      </div>

      {preview && (
        <div className="mt-3 overflow-hidden rounded-[8px] border border-black/10">
          <img src={preview} alt="Ingredient photo preview" className="h-28 w-full object-cover" />
        </div>
      )}

      {detected.length > 0 && (
        <div className="mt-3 space-y-2">
          {detected.map((item) => (
            <button
              key={item.id}
              type="button"
              className="flex w-full items-center gap-2 rounded-[8px] border border-black/10 bg-white/55 px-2 py-2 text-left"
              onClick={() => toggleDetected(item.id)}
            >
              <span className={`flex h-5 w-5 items-center justify-center rounded-[6px] border ${confirmedIds.has(item.id) ? 'bg-[color:var(--accent)] text-white' : 'bg-white/50'}`}>
                {confirmedIds.has(item.id) && <Check size={13} />}
              </span>
              <span className="text-lg leading-none">{ingredientById.get(item.id)?.icon}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-black">{item.name}</span>
                <span className="block truncate text-[11px] text-[color:var(--muted)]">{item.reason}</span>
              </span>
              <span className="text-[10px] font-black text-[color:var(--muted)]">{Math.round(item.confidence * 100)}%</span>
            </button>
          ))}

          <button
            type="button"
            disabled={!confirmedIngredients.length}
            className="w-full rounded-[8px] bg-[#2f2a24] px-3 py-2 text-xs font-black uppercase tracking-[0.14em] text-white disabled:opacity-45"
            onClick={confirmScan}
          >
            Add confirmed to blender
          </button>
        </div>
      )}
    </section>
  )
}
