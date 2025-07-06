import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ResumeImproveRequest {
  resume: string;
  targetRole: string;
  industry: string;
  experienceLevel: string;
  keySkills: string[];
  careerGoals: string;
  mode?: 'polish' | 'rewrite' | 'tailor';
  preserveStructure?: boolean;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      resume,
      targetRole,
      industry,
      experienceLevel,
      keySkills,
      careerGoals,
      mode = 'rewrite',
      preserveStructure = true
    }: ResumeImproveRequest = await req.json();

    console.log('Processing resume improvement request:', {
      targetRole,
      industry,
      experienceLevel,
      mode,
      resumeLength: resume.length
    });

    // Validate required fields
    if (!resume || !targetRole || !industry) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: resume, targetRole, and industry are required' 
        }), 
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create a strict prompt that prevents hallucination
    const systemPrompt = `You are a professional resume editor with strict guidelines. Your task is to improve resume clarity, formatting, grammar, and tone while following these CRITICAL rules:

🔒 ABSOLUTE RESTRICTIONS:
- NEVER add, remove, or change any factual information (job titles, company names, dates, contact info, skills, experiences)
- NEVER fabricate or infer missing information
- NEVER change the profession or career field
- NEVER add fake contact details, certifications, or experiences
- NEVER remove important experiences or achievements

✅ ALLOWED IMPROVEMENTS:
- Enhance grammar, spelling, and sentence structure
- Improve action verbs and impact statements
- Better formatting and organization
- Strengthen professional language and tone
- Optimize for ATS compatibility
- Add relevant keywords that align with the existing content

📋 CONTEXT PROVIDED:
- Target Role: ${targetRole}
- Industry: ${industry}
- Experience Level: ${experienceLevel}
- Key Skills: ${keySkills.join(', ')}
- Career Goals: ${careerGoals}

Use this context to guide improvements but DO NOT add content not present in the original resume.`;

    const userPrompt = `Please improve this resume while strictly following the guidelines above. The person is targeting a ${targetRole} position in the ${industry} industry.

ORIGINAL RESUME:
${resume}

Return ONLY the improved resume text with no additional commentary.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3, // Lower temperature for more consistent output
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const improvedResume = data.choices[0].message.content;

    // Generate warnings if needed
    const warnings = [];
    if (!resume.includes('@') && !resume.includes('email')) {
      warnings.push('Contact information appears to be missing from the original resume');
    }
    
    if (resume.length < 200) {
      warnings.push('Original resume appears to be quite short - consider adding more detail');
    }

    const result = {
      improved_resume: improvedResume,
      warnings,
      metadata: {
        target_role: targetRole,
        industry,
        experience_level: experienceLevel,
        mode,
        processed_at: new Date().toISOString(),
      }
    };

    console.log('Resume improvement completed successfully');

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in improve-resume function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        improved_resume: null,
        warnings: ['Failed to process resume improvement']
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});