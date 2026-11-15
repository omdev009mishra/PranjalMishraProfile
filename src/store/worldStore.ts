import { create } from 'zustand'
import { WORLD_ZONES } from '../data/zones'

type WorldState = {
  progress: number
  activeZoneId: string
  selectedObject: string | null
  setProgress: (progress: number) => void
  setActiveZone: (zoneId: string) => void
  selectObject: (objectId: string | null) => void
}

export const useWorldStore = create<WorldState>((set) => ({
  progress: 0,
  activeZoneId: WORLD_ZONES[0].id,
  selectedObject: null,
  setProgress: (progress) => set({ progress }),
  setActiveZone: (activeZoneId) => set({ activeZoneId }),
  selectObject: (selectedObject) => set({ selectedObject }),
}))
