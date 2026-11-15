export type WorldZone = {
  id: string
  index: string
  name: string
  subtitle: string
  start: number
  end: number
  description: string
}

export const WORLD_ZONES: WorldZone[] = [
  {
    id: 'awakening',
    index: '01',
    name: 'THE AWAKENING',
    subtitle: 'Enter the ecosystem',
    start: 0,
    end: 0.15,
    description: 'A signal emerges from the dark. Your journey into the living network begins here.',
  },
  {
    id: 'living-network',
    index: '02',
    name: 'THE LIVING NETWORK',
    subtitle: 'The story behind the builder',
    start: 0.15,
    end: 0.35,
    description: 'A growing network of curiosity, education, experiments and ideas.',
  },
  {
    id: 'experimentation',
    index: '03',
    name: 'THE EXPERIMENTATION ZONE',
    subtitle: 'Ideas become systems',
    start: 0.35,
    end: 0.65,
    description: 'Research stations for software, AI, computer vision and products.',
  },
  {
    id: 'technology-core',
    index: '04',
    name: 'THE TECHNOLOGY CORE',
    subtitle: 'The tools behind the work',
    start: 0.65,
    end: 0.82,
    description: 'An interconnected core of engineering disciplines and technologies.',
  },
  {
    id: 'exit-portal',
    index: '05',
    name: 'THE EXIT PORTAL',
    subtitle: 'Continue the conversation',
    start: 0.82,
    end: 1,
    description: 'Step out of the ecosystem and get in touch.',
  },
]

export function getZoneForProgress(progress: number): WorldZone {
  return WORLD_ZONES.find((zone) => progress >= zone.start && progress < zone.end)
    ?? WORLD_ZONES[WORLD_ZONES.length - 1]
}
