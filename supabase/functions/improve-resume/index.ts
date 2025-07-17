import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

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
    // Check if Gemini API key is configured
    if (!geminiApiKey) {
      console.error('GEMINI_API_KEY is not configured');
      return new Response(
        JSON.stringify({ 
          error: 'Gemini API key not configured',
          improved_resume: null,
          warnings: ['Gemini API key is missing. Please configure it in the edge function secrets.']
        }), 
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }
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

    // Create an ATS-optimized improvement prompt with clean formatting
    const systemPrompt = `You are an expert ATS-optimized resume writer. Transform the provided resume into a clean, well-organized, professional document that is easy to read and ATS-friendly.

🎯 PRIMARY OBJECTIVES:
- Create comprehensive, detailed descriptions using the user's career context
- Optimize for ATS scanning with relevant keywords
- Expand bullet points into powerful achievement statements
- Enhance professional summary with industry-specific language
- Ensure 60-80% keyword match for the target role

🔒 FACTUAL PRESERVATION:
- NEVER change job titles, company names, dates, or contact information
- NEVER fabricate specific metrics, certifications, or experiences not mentioned
- NEVER alter the core profession or career trajectory

📐 CLEAN FORMATTING REQUIREMENTS:
- Use clean, consistent spacing between sections
- Ensure contact info is clearly separated at the top
- Use standard section headers in ALL CAPS: PROFESSIONAL SUMMARY, EXPERIENCE, EDUCATION, SKILLS, PROJECTS
- Add proper line breaks between sections for readability
- Keep bullet points concise but impactful (2-3 lines maximum each)
- Use consistent bullet point formatting (• symbol)
- Ensure proper spacing between job entries
- Remove excessive formatting and keep it clean and professional
- Use consistent date formatting (Month Year format)

✅ ATS OPTIMIZATION TECHNIQUES:
- Use exact keywords from the target role: ${targetRole}
- Include industry-specific terminology for: ${industry}
- Incorporate ${experienceLevel} level expectations and language
- Weave in these key skills naturally: ${keySkills.join(', ')}
- Align descriptions with career goals: ${careerGoals}
- Use strong action verbs (Led, Managed, Implemented, Optimized, etc.)
- Include quantifiable impact statements where contextually appropriate
- Create detailed professional summary highlighting relevant expertise
- Expand experience descriptions to showcase transferable skills

📋 STRUCTURE & ORGANIZATION:
- Start with name and contact information (phone, email, location)
- Follow with PROFESSIONAL SUMMARY (3-4 impactful lines)
- List EXPERIENCE in reverse chronological order
- Include EDUCATION section with degree, institution, graduation date
- Add SKILLS section organized by categories
- Include PROJECTS or CERTIFICATIONS if relevant
- Ensure each section is clearly separated with line breaks
- Use consistent formatting throughout

✍️ WRITING STYLE IMPROVEMENTS:
- Eliminate redundant phrasing and filler words
- Vary sentence starters and action verbs
- Keep bullet points focused and achievement-oriented
- Use professional, industry-appropriate language
- Ensure readability and flow
- Remove clutter and unnecessary words
- Make every word count

🎯 TARGET CONTEXT:
- Role: ${targetRole} in ${industry}
- Level: ${experienceLevel}
- Key Skills Focus: ${keySkills.join(', ')}
- Career Direction: ${careerGoals}

Create a clean, well-organized, and professional resume that is easy to read and ATS-optimized.`;

    const userPrompt = `Please improve this resume while strictly following the guidelines above. The person is targeting a ${targetRole} position in the ${industry} industry.

ORIGINAL RESUME:
${resume}

Return ONLY the improved resume text with no additional commentary.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\n${userPrompt}`
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 4000,
        }
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Gemini API error:', error);
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', JSON.stringify(data, null, 2));
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts || !data.candidates[0].content.parts[0]) {
      console.error('Invalid Gemini API response structure:', data);
      throw new Error('Invalid response structure from Gemini API');
    }
    
    const improvedResume = data.candidates[0].content.parts[0].text;

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