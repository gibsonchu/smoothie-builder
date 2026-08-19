import { Camera, ListPlus } from 'lucide-react'

type Props = {
  onPhoto: () => void
  onChoose: () => void
}

export function ZineLanding({ onPhoto, onChoose }: Props) {
  return (
    <section className="landing-page">
      <header className="zine-masthead">
        <span>SMOOTHIE STUDY / NO. 01</span>
        <span>AUG 19 / KITCHEN NOTES</span>
      </header>

      <div className="landing-copy">
        <p className="zine-kicker">A recipe from what is already here</p>
        <h1>Make something<br />good of it.</h1>
        <p className="landing-intro">
          Show us what is on the counter, or choose it by hand. We will write the rest.
        </p>

        <div className="landing-actions" aria-label="Start a smoothie recipe">
          <button type="button" className="zine-button zine-button--accent" onClick={onPhoto}>
            <Camera aria-hidden="true" size={18} />
            Take a photo of ingredients
          </button>
          <button type="button" className="zine-button zine-button--ink" onClick={onChoose}>
            <ListPlus aria-hidden="true" size={18} />
            Choose ingredients
          </button>
        </div>
      </div>

      <figure className="landing-study" aria-hidden="true">
        <img src="/assets/zine-produce-study.webp" alt="" />
        <figcaption>FIG. 01 / USE WHAT YOU HAVE</figcaption>
      </figure>

      <p className="margin-note margin-note--left">fruit / leaf / cold / sweet</p>
      <p className="margin-note margin-note--right">nothing wasted<br />something made</p>
    </section>
  )
}
