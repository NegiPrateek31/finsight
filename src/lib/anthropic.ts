// Use the global fetch available in Node 18+ or a runtime polyfill
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/complete'

export async function callAnthropic(prompt: string, maxTokens = 250) {
  const apiKey = process.env.ANTHROPIC_API_KEY
  const model = process.env.ANTHROPIC_MODEL || 'claude-sonnet-3.5'
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY not set in env')

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({
      model,
      prompt,
      max_tokens_to_sample: maxTokens,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Anthropic API error: ${response.status} ${response.statusText} - ${errorText}`)
  }

  const data = await response.json()
  return data
}
