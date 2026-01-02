import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// OpenAI TTS has a 4096 character limit, so we need to chunk the text
const MAX_CHUNK_SIZE = 4000

function splitTextIntoChunks(text: string): string[] {
  const chunks: string[] = []
  let remaining = text

  while (remaining.length > 0) {
    if (remaining.length <= MAX_CHUNK_SIZE) {
      chunks.push(remaining)
      break
    }

    // Find a good break point (end of sentence or paragraph)
    let breakPoint = MAX_CHUNK_SIZE
    const searchArea = remaining.slice(MAX_CHUNK_SIZE - 500, MAX_CHUNK_SIZE)
    
    // Try to break at paragraph
    const paragraphBreak = searchArea.lastIndexOf('\n\n')
    if (paragraphBreak !== -1) {
      breakPoint = MAX_CHUNK_SIZE - 500 + paragraphBreak + 2
    } else {
      // Try to break at sentence
      const sentenceBreak = searchArea.lastIndexOf('. ')
      if (sentenceBreak !== -1) {
        breakPoint = MAX_CHUNK_SIZE - 500 + sentenceBreak + 2
      }
    }

    chunks.push(remaining.slice(0, breakPoint).trim())
    remaining = remaining.slice(breakPoint).trim()
  }

  return chunks
}

async function generateAudioForChunk(text: string, apiKey: string, voice: string): Promise<ArrayBuffer> {
  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'tts-1',
      input: text,
      voice: voice || 'nova',
      response_format: 'mp3',
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    console.error('OpenAI TTS error:', error)
    throw new Error(error.error?.message || 'Failed to generate speech')
  }

  return response.arrayBuffer()
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, voice } = await req.json()

    if (!text) {
      throw new Error('Text is required')
    }

    const apiKey = Deno.env.get('OPENAI_API_KEY')
    if (!apiKey) {
      throw new Error('OpenAI API key not configured')
    }

    console.log('Generating speech for text of length:', text.length)

    // Split text into chunks
    const chunks = splitTextIntoChunks(text)
    console.log(`Split into ${chunks.length} chunks`)

    // Generate audio for each chunk
    const audioBuffers: ArrayBuffer[] = []
    for (let i = 0; i < chunks.length; i++) {
      console.log(`Processing chunk ${i + 1}/${chunks.length}, length: ${chunks[i].length}`)
      const buffer = await generateAudioForChunk(chunks[i], apiKey, voice || 'nova')
      audioBuffers.push(buffer)
    }

    // Concatenate all audio buffers
    const totalLength = audioBuffers.reduce((sum, buf) => sum + buf.byteLength, 0)
    const combined = new Uint8Array(totalLength)
    let offset = 0
    for (const buffer of audioBuffers) {
      combined.set(new Uint8Array(buffer), offset)
      offset += buffer.byteLength
    }

    console.log('Generated combined audio size:', combined.byteLength, 'bytes')

    return new Response(combined.buffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'audio/mpeg',
      },
    })
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('TTS Error:', errorMessage)
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})
