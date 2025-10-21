import { callAnthropic } from '../src/lib/anthropic'

async function main() {
  try {
    const response = await callAnthropic('Say hello from Claude Sonnet 3.5', 64)
    console.log('Anthropic response:', JSON.stringify(response, null, 2))
  } catch (err) {
    console.error('Error calling Anthropic:', err)
    process.exit(1)
  }
}

main()
