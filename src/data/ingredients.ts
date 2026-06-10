export type Ingredient = {
  id: string
  name: string
  icon: string
  color: string
  rotation: number
}

export const ingredients: Ingredient[] = [
  { id: 'strawberry', name: 'Strawberry', icon: '🍓', color: '#E64B5D', rotation: -2 },
  { id: 'banana', name: 'Banana', icon: '🍌', color: '#F4D35E', rotation: 2 },
  { id: 'mango', name: 'Mango', icon: '🥭', color: '#F7A531', rotation: -1 },
  { id: 'blueberry', name: 'Blueberry', icon: '🫐', color: '#4056A1', rotation: 3 },
  { id: 'spinach', name: 'Spinach', icon: '🌿', color: '#4E8C45', rotation: -3 },
  { id: 'kale', name: 'Kale', icon: '🥬', color: '#326A3A', rotation: 2 },
  { id: 'pineapple', name: 'Pineapple', icon: '🍍', color: '#F5C84B', rotation: -2 },
  { id: 'apple', name: 'Apple', icon: '🍎', color: '#D94133', rotation: 1 },
  { id: 'peach', name: 'Peach', icon: '🍑', color: '#F2A07B', rotation: -1 },
  { id: 'raspberry', name: 'Raspberry', icon: '🫐', color: '#C2265D', rotation: 2 },
  { id: 'avocado', name: 'Avocado', icon: '🥑', color: '#7CA65B', rotation: -3 },
  { id: 'coconut', name: 'Coconut', icon: '🥥', color: '#EFE0C2', rotation: 1 },
  { id: 'ginger', name: 'Ginger', icon: '🫚', color: '#D8A45D', rotation: 3 },
  { id: 'oat-milk', name: 'Oat Milk', icon: '🥛', color: '#EBD8B7', rotation: -2 },
  { id: 'almond-milk', name: 'Almond Milk', icon: '🥛', color: '#F2E5CF', rotation: 2 },
  { id: 'greek-yogurt', name: 'Greek Yogurt', icon: '🥣', color: '#FFF7E8', rotation: -1 },
  { id: 'honey', name: 'Honey', icon: '🍯', color: '#E9A825', rotation: 2 },
  { id: 'chia-seeds', name: 'Chia Seeds', icon: '·', color: '#2F2B2C', rotation: -2 },
  { id: 'vanilla-protein', name: 'Vanilla Protein', icon: '💪', color: '#EFE3C7', rotation: 3 },
  { id: 'ice', name: 'Ice', icon: '🧊', color: '#BFEAF5', rotation: -1 },
]
