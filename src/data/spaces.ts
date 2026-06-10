export type Space = {
  id: string
  label: string
  shortLabel: string
  vibe: string
  className: string
  palette: [string, string, string]
}

export const spaces: Space[] = [
  {
    id: 'cabin',
    label: 'Cabin in the Woods',
    shortLabel: 'Cabin',
    vibe: 'Slow Sunday, amber fog, dark wood.',
    className: 'space-cabin',
    palette: ['#3B2A1A', '#C9A96E', '#F5EDD8'],
  },
  {
    id: 'barrys',
    label: "Barry's Bootcamp",
    shortLabel: "Barry's",
    vibe: 'Red lights, black steel, no coasting.',
    className: 'space-barrys',
    palette: ['#0D0D0D', '#E8001D', '#F0F0F0'],
  },
  {
    id: 'noguchi',
    label: 'Noguchi Museum Garden',
    shortLabel: 'Noguchi',
    vibe: 'Stone, paper, plant, silence.',
    className: 'space-noguchi',
    palette: ['#E8E4DC', '#9B9080', '#2C2B29'],
  },
  {
    id: 'beach',
    label: 'Beachside Waterfront',
    shortLabel: 'Beachside',
    vibe: 'Salt haze, bleached wood, marina light.',
    className: 'space-beach',
    palette: ['#EAF4F4', '#7EC8C8', '#C8A97E'],
  },
  {
    id: 'milan',
    label: 'Milanese Kitchen',
    shortLabel: 'Milan',
    vibe: 'Terrazzo, olive cabinetry, brass glow.',
    className: 'space-milan',
    palette: ['#D4CFC6', '#5B6B47', '#C8B89A'],
  },
  {
    id: 'tokyo',
    label: 'Tokyo Convenience',
    shortLabel: 'Tokyo',
    vibe: 'Fluorescent grid, plastic shine, 2am.',
    className: 'space-tokyo',
    palette: ['#FAFAFA', '#FF3B3B', '#0057FF'],
  },
]
