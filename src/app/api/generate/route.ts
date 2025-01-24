import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

export async function POST(req: Request) {
  try {
    const { prompt, fieldType, promptPrefix } = await req.json()
    
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const result = await model.generateContent(`
      As a professional resume writer, generate content based on these strict guidelines:

      ${promptPrefix} ${prompt}

      Formatting rules:
      ${fieldType === 'accomplishment' ? `
      - Start with a strong action verb (e.g., "Developed", "Implemented")
      - Follow with specific achievement/impact
      - Include metrics where possible (e.g., "increasing efficiency by 25%")
      - Keep to 12-20 words
      - No markdown formatting
      - Example: "Led cross-functional team to deliver SaaS platform 2 weeks ahead of schedule"
      ` : fieldType === 'skills' ? `
      - Comma-separated list of 5-8 technical skills
      - Use industry-standard terms
      - Order by relevance/importance
      - Example: "Python, React, AWS, Docker, PostgreSQL"
      ` : `
      - Concise professional phrasing
      - Avoid first-person pronouns
      - Use title case for proper nouns
      - Example: "Bachelor of Science in Computer Engineering"
      `}
    `)
    
    const response = await result.response
    const text = response.text()
    
    return Response.json({ text })
  } catch (error) {
    console.error('Error generating text:', error)
    return Response.json({ error: 'Failed to generate text' }, { status: 500 })
  }
}

