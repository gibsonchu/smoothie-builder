import { ingredients as ingredientCatalog, type Ingredient } from '../data/ingredients'

export type Recipe = {
  name: string
  serves: string
  calories: number
  nutrition: {
    protein: string
    carbs: string
    fat: string
    fiber: string
  }
  ingredients: { item: string; amount: string }[]
  steps: string[]
  grandmasNote?: string
}

export type DetectedIngredient = {
  id: string
  name: string
  confidence: number
  reason: string
}

export type PhotoScanResult = {
  ingredients: DetectedIngredient[]
  apiKeyMissing?: boolean
}

const fallbackAmounts = ['1 cup', '1 medium', '3/4 cup', '1 tablespoon']

export const fallbackRecipe = (ingredients: Ingredient[]): Recipe => ({
  name: `${ingredients[0]?.name ?? 'Fruit'} Smoothie`,
  serves: 'Serves 2',
  calories: 285,
  nutrition: {
    protein: '9g',
    carbs: '48g',
    fat: '7g',
    fiber: '8g',
  },
  ingredients: ingredients.map((ingredient, index) => ({
    item: ingredient.name,
    amount: fallbackAmounts[index % fallbackAmounts.length],
  })),
  steps: [
    'Add the liquid ingredients to the blender.',
    'Add the remaining ingredients and ice.',
    'Blend on high until smooth, about 45 seconds.',
    'Pour into two glasses and serve immediately.',
  ],
})

const parseRecipe = (content: string, ingredients: Ingredient[]) => {
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/)
  const raw = fenced?.[1] ?? content
  try {
    const parsed = JSON.parse(raw) as Partial<Recipe>
    const fallback = fallbackRecipe(ingredients)
    const servingCount = typeof parsed.serves === 'string' ? parsed.serves.match(/\d+/)?.[0] : undefined
    return {
      ...fallback,
      ...parsed,
      serves: servingCount ? `Serves ${servingCount}` : fallback.serves,
      nutrition: { ...fallback.nutrition, ...parsed.nutrition },
      ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients : fallback.ingredients,
      steps: Array.isArray(parsed.steps) ? parsed.steps : fallback.steps,
    }
  } catch {
    return fallbackRecipe(ingredients)
  }
}

export async function generateRecipe(ingredients: Ingredient[]): Promise<Recipe> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  if (!apiKey) return fallbackRecipe(ingredients)

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You are a practical recipe writer. Write clear, concise smoothie recipes with standard measurements and direct instructions. Avoid first-person phrasing, affection, jokes, whimsical language, and cute names. Include a reasonable estimated calorie count and simple macro estimates per serving.',
          },
          {
            role: 'user',
            content: `Create a smoothie recipe using: ${ingredients.map((item) => item.name).join(', ')}. Format your response as JSON with fields: name (string), serves (string, formatted exactly like "Serves 2"), calories (number per serving), nutrition ({protein, carbs, fat, fiber} as strings with units), ingredients (array of {item, amount}), and steps (array of 3-5 concise strings).`,
          },
        ],
      }),
    })

    if (!response.ok) return fallbackRecipe(ingredients)

    const json = await response.json()
    return parseRecipe(json.choices?.[0]?.message?.content ?? '', ingredients)
  } catch {
    return fallbackRecipe(ingredients)
  }
}

export async function identifyIngredientsFromPhoto(imageDataUrl: string): Promise<PhotoScanResult> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY
  if (!apiKey) return { ingredients: [], apiKeyMissing: true }

  const allowedIngredients = ingredientCatalog.map((ingredient) => ({
    id: ingredient.id,
    name: ingredient.name,
  }))

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content:
              'You identify smoothie ingredients from a user photo. Only return ingredients from the allowed catalog. Be conservative: skip anything you cannot see clearly. Return JSON only.',
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Identify fruit, vegetables, liquids, smoothie boosters, and ice visible in this photo. Allowed catalog: ${JSON.stringify(allowedIngredients)}. Return JSON with shape {"ingredients":[{"id":"catalog-id","name":"Catalog Name","confidence":0.0-1.0,"reason":"short visual cue"}]}.`,
              },
              {
                type: 'image_url',
                image_url: { url: imageDataUrl },
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) return { ingredients: [] }

    const json = await response.json()
    const parsed = JSON.parse(json.choices?.[0]?.message?.content ?? '{"ingredients":[]}')
    const knownIds = new Set(ingredientCatalog.map((ingredient) => ingredient.id))
    const found = Array.isArray(parsed.ingredients) ? parsed.ingredients : []

    return {
      ingredients: found
        .filter((item): item is DetectedIngredient => {
          return (
            typeof item?.id === 'string' &&
            knownIds.has(item.id) &&
            typeof item.name === 'string' &&
            typeof item.confidence === 'number'
          )
        })
        .map((item) => ({
          id: item.id,
          name: ingredientCatalog.find((ingredient) => ingredient.id === item.id)?.name ?? item.name,
          confidence: Math.max(0, Math.min(1, item.confidence)),
          reason: typeof item.reason === 'string' ? item.reason : 'Visible in the photo',
        })),
    }
  } catch {
    return { ingredients: [] }
  }
}
