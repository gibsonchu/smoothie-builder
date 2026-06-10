export type GlassId =
  | 'highball'
  | 'mason'
  | 'stemless'
  | 'mug'
  | 'coupe'
  | 'wood'
  | 'doublewall'
  | 'vintage'

export type Glassware = {
  id: GlassId
  name: string
  note: string
}

export const glassware: Glassware[] = [
  { id: 'highball', name: 'Highball', note: 'Tall, thin walls' },
  { id: 'mason', name: 'Mason Jar', note: 'Wide-mouth, thick glass' },
  { id: 'stemless', name: 'Stemless Wine', note: 'Soft rounded bowl' },
  { id: 'mug', name: 'Ceramic Mug', note: 'Chunky matte handle' },
  { id: 'coupe', name: 'Coupe', note: 'Wide vintage bowl' },
  { id: 'wood', name: 'Acacia Cup', note: 'Warm wood grain' },
  { id: 'doublewall', name: 'Double-Wall', note: 'Floating inner wall' },
  { id: 'vintage', name: 'Juice Glass', note: 'Ribbed lower third' },
]
