import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import 'dotenv/config'
import { cors } from 'hono/cors'

const app = new Hono()

// Enable CORS for all origins
app.use('*', cors())

// AI Vendor Generation Route
app.post('/generate-vendors', async (c) => {
  try {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL_VENDORS,
        provider: {
          require_parameters: true,
        },
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: 'vendor_profiles',
            strict: true,
            schema: {
              type: 'object',
              properties: {
                vendors: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: {
                        type: 'string',
                        description: 'A realistic company name for the vendor.',
                      },
                      country: {
                        type: 'string',
                        description: 'The country where the vendor is based.',
                      },
                      industry: {
                        type: 'string',
                        description:
                          'The industry the vendor operates in (e.g., Textiles, Electronics, Pharmaceuticals).',
                      },
                      compliance_rating: {
                        type: 'integer',
                        enum: [1, 2, 3, 4, 5],
                        description:
                          "Vendor's compliance rating from 1 (worst) to 5 (best). A higher rating suggests better regulatory compliance. Some vendors may have a high compliance rating (even 5) but still have violations. While a low rating usually indicates violations, it's not guaranteed.",
                      },
                      has_violations: {
                        type: 'boolean',
                        description:
                          'True if the vendor has a history of labor law violations, such as child labor or unsafe working conditions. More likely in industries like Textiles, Agriculture, or Manufacturing.\n\nEnvironmental violations, such as illegal waste disposal. More common in industries like Agriculture, Mining, and Energy.\n\nOr other financial or legal issues, such as bankruptcy or fraud. More likely in industries like Finance, Real Estate, and Construction.',
                      },
                      approval_consequence: {
                        type: 'string',
                        description:
                          "Describe the logical consequence of the player approving this vendor. Use past tense. If the vendor has violations, generate a realistic scandal, fine, or regulatory issue. If the vendor is good, provide a benefit (e.g., increased reputation or efficiency).\n\nExample (Bad Vendor): 'A major news outlet has exposed your supplier's use of forced labor. Your company faces public backlash and investor concerns.'\n\nExample (Good Vendor): 'Your decision to work with this vendor improves your reputation for ethical sourcing. Investors take notice, and your credibility rises.'",
                      },
                      rejection_consequence: {
                        type: 'string',
                        description:
                          "Describe the realistic consequence of the player rejecting this vendor. Use past tense. If the vendor was good, penalize the player with supply chain delays or reputation loss. If the vendor was bad, provide a benefit but still include a slight cost.\n\nExample (Rejected Good Vendor): 'Your company has lost a key supplier. Production is delayed by two weeks, increasing costs.'\n\nExample (Rejected Bad Vendor): 'Your team avoids a major compliance scandal. However, securing an alternative vendor takes additional effort, leading to minor delays.'",
                      },
                      audit_result: {
                        type: 'string',
                        description:
                          "Describe the result of an audit based on the vendor's violations. If there are violations, describe them in realistic detail. If there are no violations, describe how the vendor passed compliance checks.\n\nExample (Bad Vendor): 'Investigators found evidence of improper waste disposal near a protected wetland area, violating environmental safety regulations.'\n\nExample (Good Vendor): 'The audit confirmed that the vendor follows strict ethical labor laws and complies with all regulations.'",
                      },
                      vendor_defense: {
                        type: 'string',
                        description:
                          "Provide a short, persuasive defense from the vendor justifying why they should be approved, even if they have violations. If they have no violations, they should confidently affirm their compliance.\n\nExample (Bad Vendor): 'We acknowledge past challenges but have implemented strict policies to prevent further violations.'\n\nExample (Good Vendor): 'We have a long history of ethical labor practices and are committed to sustainability.'",
                      },
                    },
                    required: [
                      'name',
                      'country',
                      'industry',
                      'compliance_rating',
                      'has_violations',
                      'approval_consequence',
                      'rejection_consequence',
                      'audit_result',
                      'vendor_defense',
                    ],
                    additionalProperties: false,
                  },
                  description: 'An array of vendor profiles.',
                },
              },
              required: ['vendors'],
              additionalProperties: false,
            },
          },
        },
        messages: [
          {
            role: 'system',
            content:
              'You are an AI that generates highly realistic vendor profiles for a supply chain compliance simulation game. Ensure vendors have logical violations and realistic consequences for approval or rejection. All generated content must follow the provided schema.',
          },
          {
            role: 'user',
            content:
              "Generate 10 vendors profiles with realistic data. The vendors' violations should align logically with their industry. Some vendors should have no compliance violations, but they should be a minority.",
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`)
    }

    const data = await response.json()
    return c.json(JSON.parse(data.choices[0].message.content))
    // return c.json(data)
  } catch (error) {
    console.error('Error calling OpenRouter:', error)
    return c.json({ error: 'Failed to generate vendor' }, 500)
  }
})

app.post('/analyze-game', async (c) => {
  const { vendors, eventLog } = await c.req.json()

  try {
    const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

    const messages = [
      {
        role: 'system',
        content:
          "You are an AI that analyzes games for a supply chain compliance simulation game. Based on the vendors data and the player event log, you suggest what the player could've done differently to win. Keep in mind that the player doesn't see if a vendor has violations or not, they can only see the compliance_rating and vendor_defense. If the player decides to conduct an audit, they can also see audit_result.",
      },
      {
        role: 'user',
        content: 'VENDORS DATA:\n' + JSON.stringify(vendors),
      },
      {
        role: 'user',
        content: 'PLAYER EVENT LOG:\n' + JSON.stringify(eventLog),
      },
    ]

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL_ANALYZE,
        messages,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`)
    }

    const data = await response.json()
    return c.json(data.choices[0].message.content)
  } catch (error) {
    console.error('Error calling OpenRouter:', error)
    return c.json({ error: 'Failed to generate vendor' }, 500)
  }
})

serve({
  fetch: app.fetch,
  port: 3001,
})

console.log('✅ Server running on http://localhost:3001')
