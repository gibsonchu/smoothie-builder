import { ingredients as ingredientCatalog, type Ingredient } from '../data/ingredients'

export type Recipe = {
  name: string
  serves: string
  ingredients: { item: string; amount: string }[]
  steps: string[]
  grandmasNote: string
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

const fallbackAmounts = ['a good handful', 'one ripe scoop', 'a cheerful splash', 'a little spoonful']

export const fallbackRecipe = (ingredients: Ingredient[]): Recipe => ({
  name: `${ingredients[0]?.name ?? 'Sunny'} Porch Smoothie`,
  serves: 'Serves 2, or one hungry sweetheart',
  ingredients: ingredients.map((ingredient, index) => ({
    item: ingredient.name,
    amount: fallbackAmounts[index % fallbackAmounts.length],
  })),
  steps: [
    'I tuck the soft things into the blender first so everything settles down nicely.',
    'Add the milk or yogurt, then the colder bits, and let the blender hum until it looks silky.',
    'Taste it with a little spoon and sweeten only if it asks you politely.',
    'Pour it right away, while it is still frosty and proud of itself.',
  ],
  grandmasNote:
    "If it gets too thick, I add one small splash at a time. Smoothies like patience, darling.",
})

const parseRecipe = (content: string, ingredients: Ingredient[]) => {
  const fenced = content.match(/```(?:json)?\s*([\s\S]*?)```/)
  const raw = fenced?.[1] ?? content
  try {
    return JSON.parse(raw) as Recipe
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
              "You are a warm, loving grandmother who has been making smoothies for 40 years. Write recipes in first person, casually and affectionately, like you're writing a note card for your grandchild. Use imprecise, loving language: 'a good handful', 'until it looks right'. Always give the smoothie a charming name.",
          },
          {
            role: 'user',
            content: `Make me a smoothie recipe using: ${ingredients.map((item) => item.name).join(', ')}. Format your response as JSON with fields: name (string), serves (string), ingredients (array of {item, amount}), steps (array of strings), grandmasNote (string).`,
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
