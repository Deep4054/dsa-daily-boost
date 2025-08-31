import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, chatType, topic, context } = await req.json();
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    let systemPrompt = '';
    
    if (chatType === 'dsa-help') {
      systemPrompt = `You are a DSA (Data Structures and Algorithms) learning assistant. Help users understand concepts, solve problems, and improve their coding skills. 

Current topic: ${topic || 'General DSA'}

Provide:
- Clear explanations of concepts
- Step-by-step problem-solving approaches
- Time and space complexity analysis
- Code examples when helpful
- Practice suggestions
- Common patterns and techniques

Keep responses concise but thorough. If the user asks about a specific problem, break down the approach clearly.`;
    } else {
      systemPrompt = `You are a helpful AI assistant. Provide clear, accurate, and helpful responses to user questions. Keep responses concise and relevant.`;
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...context.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An error occurred' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});