import { Camera, ListPlus } from 'lucide-react'

type Props = {
  onPhoto: () => void
  onChoose: () => void
}

export function ZineLanding({ onPhoto, onChoose }: Props) {
  return (
    <section className="landing-page">
      <div className="landing-copy">
        <h1>Got juice?</h1>

        <img
          className="landing-artwork"
          src="/assets/zine-produce-study.webp"
          alt="Strawberry, leafy greens, apple, blueberries, and a glass"
        />

        <div className="landing-actions" aria-label="Start a smoothie recipe">
          <button type="button" className="zine-button zine-button--accent" onClick={onPhoto}>
            <Camera aria-hidden="true" size={18} />
            Photo
          </button>
          <button type="button" className="zine-button zine-button--ink" onClick={onChoose}>
            <ListPlus aria-hidden="true" size={18} />
            Select
          </button>
        </div>
      </div>
    </section>
  )
}
