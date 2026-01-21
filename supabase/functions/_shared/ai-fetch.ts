/**
 * Shared utility for making AI API calls with timeout and error handling
 */

interface AIFetchOptions {
  apiKey: string;
  model: string;
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
  timeout?: number; // milliseconds, default 60000 (60s)
}

interface AIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

/**
 * Fetch from AI gateway with timeout and error handling
 */
export async function fetchAI(options: AIFetchOptions): Promise<string> {
  const {
    apiKey,
    model,
    messages,
    temperature = 0.7,
    timeout = 60000,
  } = options;

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  let response: Response;
  try {
    response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
      }),
      signal: controller.signal,
    });
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const errorText = await response.text();
    console.error('AI API error:', response.status, errorText);

    // Handle specific error codes
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again in a few minutes.');
    }
    if (response.status === 402) {
      throw new Error('AI credits exhausted. Please try again later.');
    }

    throw new Error(`AI API error: ${response.status}`);
  }

  const data: AIResponse = await response.json();
  return data.choices[0].message.content;
}

/**
 * Parse JSON from AI response (handles markdown code blocks)
 */
export function parseAIJSON<T>(content: string): T {
  // Extract JSON from response (handles markdown code blocks)
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('No JSON found in response');
  }

  let parsed: T;
  try {
    parsed = JSON.parse(jsonMatch[0]);
  } catch (parseError) {
    console.error('JSON parsing error:', parseError);
    throw new Error('Invalid response format from AI. Please try again.');
  }

  return parsed;
}

/**
 * Validate that required fields exist in parsed JSON
 */
export function validateRequiredFields(
  data: Record<string, unknown>,
  requiredFields: string[]
): void {
  const missingFields = requiredFields.filter(field => !data[field]);
  if (missingFields.length > 0) {
    console.error('Missing required fields:', missingFields);
    throw new Error('Incomplete reading generated. Please try again.');
  }
}
