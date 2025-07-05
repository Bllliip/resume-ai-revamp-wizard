import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openaiApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { targetRole, industry, experienceLevel, keySkills, careerGoals, originalResume } = await req.json();

    // Validate input
    if (!originalResume || originalResume.trim().length < 100) {
      return new Response(JSON.stringify({ 
        error: 'Original resume is required and must be at least 100 characters long' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Construct anti-hallucination prompt
    const systemPrompt = `You are a professional resume editor with strict rules:

CRITICAL RULES - NEVER BREAK THESE:
1. NEVER add, invent, or fabricate ANY information not explicitly provided in the original resume
2. NEVER change job titles, company names, dates, or professional experiences
3. NEVER add contact information (phone, email, address) if not provided
4. NEVER invent skills, certifications, or achievements
5. NEVER change the person's career field or professional domain
6. ONLY improve grammar, clarity, formatting, and professional tone
7. Keep all factual details exactly as provided

Your role is to POLISH and ENHANCE the existing content, not create new content.`;

    const userPrompt = `Please improve the following resume while strictly following the rules above.

TARGET ROLE: ${targetRole || 'Not specified'}
INDUSTRY: ${industry || 'Not specified'}
EXPERIENCE LEVEL: ${experienceLevel || 'Not specified'}
KEY SKILLS TO HIGHLIGHT: ${keySkills?.join(', ') || 'None specified'}
CAREER GOALS: ${careerGoals || 'Not specified'}

ORIGINAL RESUME TO IMPROVE:
${originalResume}

INSTRUCTIONS:
- Enhance clarity, grammar, and professional tone
- Improve action verbs and impact statements where appropriate
- Optimize for ATS (Applicant Tracking System) compatibility
- Maintain the original structure and all factual information
- Use the target role and industry context to guide improvements
- If targeting "${targetRole}" in "${industry}", ensure language aligns with that field
- DO NOT add any information not present in the original resume
- DO NOT change any facts, dates, companies, or experiences

Return only the improved resume text without additional commentary.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4.1-2025-04-14',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.3, // Lower temperature for more consistent, conservative output
        max_tokens: 2500,
        presence_penalty: 0, // Don't encourage new topics
        frequency_penalty: 0, // Don't discourage repetition of important terms
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI API Error:', errorData);
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const improvedResume = data.choices[0]?.message?.content || '';

    if (!improvedResume.trim()) {
      throw new Error('OpenAI returned empty response');
    }

    // Basic validation - check if response is reasonable
    const originalLength = originalResume.length;
    const improvedLength = improvedResume.length;
    
    // If the improved version is drastically different in length, it might be hallucinated
    if (improvedLength < originalLength * 0.5 || improvedLength > originalLength * 2) {
      console.warn('Improved resume length significantly different from original', {
        originalLength,
        improvedLength
      });
    }

    return new Response(JSON.stringify({ 
      improvedResume,
      warnings: improvedLength < originalLength * 0.5 ? 
        ['Improved resume is significantly shorter than original - please review carefully'] : []
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in improve-resume function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to improve resume. Please try again.',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});