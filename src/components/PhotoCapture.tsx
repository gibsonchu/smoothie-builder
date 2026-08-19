import { Camera, ImageUp, LoaderCircle, ScanLine, X } from 'lucide-react'
import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import type { Ingredient } from '../data/ingredients'
import { identifyIngredientsFromPhoto } from '../lib/openai'

type Detection = {
  preview: string
  detected: Ingredient[]
  message: string
}

type Props = {
  catalog: Ingredient[]
  onDetected: (result: Detection) => void
}

const fileToDataUrl = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(String(reader.result))
  reader.onerror = () => reject(new Error('Could not read image'))
  reader.readAsDataURL(file)
})

const resizeImage = (dataUrl: string) => new Promise<string>((resolve) => {
  const image = new Image()
  image.onload = () => {
    const scale = Math.min(1, 1400 / Math.max(image.width, image.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(image.width * scale)
    canvas.height = Math.round(image.height * scale)
    const context = canvas.getContext('2d')
    if (!context) return resolve(dataUrl)
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    resolve(canvas.toDataURL('image/jpeg', 0.84))
  }
  image.onerror = () => resolve(dataUrl)
  image.src = dataUrl
})

export function PhotoCapture({ catalog, onDetected }: Props) {
  const uploadRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [mode, setMode] = useState<'intro' | 'camera' | 'scanning'>('intro')
  const [error, setError] = useState<string | null>(null)

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
  }

  useEffect(() => stopCamera, [])

  const analyze = async (preview: string) => {
    stopCamera()
    setMode('scanning')
    setError(null)
    const imageDataUrl = await resizeImage(preview)
    const result = await identifyIngredientsFromPhoto(imageDataUrl)
    const foundIds = new Set(result.ingredients.map((item) => item.id))
    const detected = catalog.filter((item) => foundIds.has(item.id))
    const message = result.apiKeyMissing
      ? 'Photo identification needs VITE_OPENAI_API_KEY. Add ingredients below by hand.'
      : detected.length
        ? `We found ${detected.length} ingredient${detected.length === 1 ? '' : 's'}. Check the list before continuing.`
        : 'Nothing was identified with confidence. Add what you see below.'
    onDetected({ preview, detected, message })
  }

  const startCamera = async () => {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      })
      streamRef.current = stream
      setMode('camera')
      window.setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream
      }, 0)
    } catch {
      setError('Camera access was not available. Check your browser permission, or upload a photo instead.')
    }
  }

  const capture = () => {
    const video = videoRef.current
    if (!video || !video.videoWidth) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')?.drawImage(video, 0, 0)
    void analyze(canvas.toDataURL('image/jpeg', 0.88))
  }

  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      await analyze(await fileToDataUrl(file))
    } catch {
      setError('That file could not be read. Try a JPG, PNG, or HEIC photo.')
    }
  }

  return (
    <section className="capture-page">
      <div className={`capture-shell${mode === 'intro' ? ' capture-shell--intro' : ''}`}>
        {mode === 'intro' ? (
          <div className="capture-actions">
            <button type="button" className="zine-button zine-button--accent" onClick={startCamera}>
              <Camera size={19} /> Take a Photo
            </button>
            <button type="button" className="zine-button zine-button--paper" onClick={() => uploadRef.current?.click()}>
              <ImageUp size={19} /> Upload a Photo
            </button>
          </div>
        ) : null}

        {mode === 'camera' ? (
          <div className="camera-stage">
            <video ref={videoRef} autoPlay playsInline muted aria-label="Camera preview" />
            <div className="camera-frame" aria-hidden="true" />
            <button type="button" className="camera-close" onClick={() => { stopCamera(); setMode('intro') }} aria-label="Close camera" title="Close camera">
              <X size={20} />
            </button>
            <button type="button" className="camera-shutter" onClick={capture} aria-label="Take photo" title="Take photo">
              <Camera size={23} />
            </button>
          </div>
        ) : null}

        {mode === 'scanning' ? (
          <div className="scanning-state" role="status">
            <LoaderCircle className="scan-spinner" size={34} />
            <ScanLine size={56} />
            <h1>Reading the counter...</h1>
            <p>Looking for fruit, greens, liquids, and small useful things.</p>
          </div>
        ) : null}

        {error ? <p className="capture-error" role="alert">{error}</p> : null}
        <input ref={uploadRef} className="sr-only" type="file" accept="image/*" onChange={upload} />
      </div>
    </section>
  )
}
