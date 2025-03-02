import { StreamingTextResponse, OpenAIStream } from "ai"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const { messages } = await req.json()

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    stream: true,
    messages: [
      {
        role: "system",
        content: `You are TradeGPT, an AI trading assistant specialized in market analysis and trading strategies. 
        Provide concise, data-driven insights about trading strategies, market trends, and risk analysis. 
        Focus on practical advice and clear explanations. Use Markdown formatting for better readability, 
        including numbered lists and line breaks where appropriate. Always relate your responses to current 
        market conditions and trading opportunities.`,
      },
      ...messages,
    ],
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}

