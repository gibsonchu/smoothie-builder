import OpenAI from 'openai'
import type { Ingredient } from '../data/ingredients'

export type Recipe = {
  name: string
  serves: string
  ingredients: { item: string; amount: string }[]
  steps: string[]
  grandmasNote: string
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

  const client = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  })

  try {
    const response = await client.chat.completions.create({
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
    })

    return parseRecipe(response.choices[0]?.message?.content ?? '', ingredients)
  } catch {
    return fallbackRecipe(ingredients)
  }
}
