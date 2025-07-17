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

    // Create an ATS-optimized improvement prompt with expanded content and professional formatting
    const systemPrompt = `You are an expert ATS-optimized resume writer. Transform the provided resume into a comprehensive, eloquent, and visually polished document that impresses both ATS systems and human recruiters.

🎯 PRIMARY OBJECTIVES:
- Create highly detailed, expansive descriptions that showcase depth of experience
- Optimize thoroughly for ATS scanning with strategically placed industry keywords
- Transform bullet points into powerful, detailed achievement statements with impressive metrics
- Create an exceptional professional summary that positions the candidate as an industry authority
- Ensure 75-90% keyword match for the target role with natural language integration
- Add 30-50% more substantive content while maintaining readability

🔒 FACTUAL PRESERVATION:
- NEVER change job titles, company names, dates, or contact information
- NEVER fabricate specific metrics, certifications, or experiences not mentioned
- NEVER alter the core profession or career trajectory

📐 PROFESSIONAL FORMATTING & VISUAL EXCELLENCE:
- Use elegant, consistent spacing between all sections (double line breaks)
- Create clear visual hierarchy with proper indentation and formatting
- Format contact info professionally at the top with appropriate spacing
- Use standardized section headers in ALL CAPS and bold: **PROFESSIONAL SUMMARY**, **EXPERIENCE**, **EDUCATION**, **SKILLS**, **PROJECTS**
- Add strategic line breaks between sections for optimal visual flow
- Format bullet points with professional symbols and consistent spacing
- Ensure impeccable alignment and visual consistency throughout
- Use consistent date formatting (Month Year) right-aligned when possible
- Create clear visual separation between different job positions
- Ensure the document appears refined and executive-level in presentation

💼 COMPREHENSIVE CONTENT EXPANSION:
- Expand the professional summary to 6-8 impactful lines that establish authority
- Develop each experience bullet point into a detailed, impressive achievement (3-5 lines each)
- Add context about company/organization impact where appropriate
- Include specific methodologies, tools, and approaches used
- Expand skills section with detailed subcategories and proficiency levels
- Elaborate on projects with more technical details and business outcomes
- Add strategic keywords throughout without disrupting natural reading flow
- Develop a cohesive narrative that tells a compelling career progression story

✅ ADVANCED ATS OPTIMIZATION TECHNIQUES:
- Integrate exact keywords from the target role: ${targetRole} (minimum 3 times)
- Incorporate comprehensive industry terminology for: ${industry} (minimum 5 terms)
- Weave in sophisticated ${experienceLevel}-level language and expectations
- Strategically place these key skills throughout the document: ${keySkills.join(', ')}
- Align expanded descriptions with career aspirations: ${careerGoals}
- Use powerful, varied action verbs (Spearheaded, Orchestrated, Revolutionized, etc.)
- Include detailed quantifiable impact statements with specific metrics and percentages
- Create an authoritative professional summary highlighting distinctive expertise
- Develop experience descriptions that showcase strategic thinking and leadership

📋 ENHANCED STRUCTURE & ORGANIZATION:
- Begin with prominently displayed name and complete contact information
- Follow with an expanded PROFESSIONAL SUMMARY (6-8 impactful lines)
- List EXPERIENCE in reverse chronological order with detailed role descriptions
- Include comprehensive EDUCATION section with relevant coursework and achievements
- Develop an extensive SKILLS section organized by categories with proficiency levels
- Add detailed PROJECTS or CERTIFICATIONS sections with expanded descriptions
- Ensure perfect visual spacing and formatting between all sections
- Maintain consistent formatting throughout with attention to visual appeal

✍️ SOPHISTICATED WRITING STYLE:
- Use elevated, executive-level language appropriate for the target role
- Employ diverse sentence structures and sophisticated vocabulary
- Craft compelling narrative threads that connect experiences
- Use industry-specific terminology to demonstrate domain expertise
- Ensure exceptional readability and natural flow despite expanded content
- Remove any repetitive phrasing or redundant expressions
- Create impactful topic sentences followed by supporting details
- Use parallel structure throughout all bullet points for consistency

🎯 TARGET CONTEXT:
- Role: ${targetRole} in ${industry}
- Level: ${experienceLevel}
- Key Skills Focus: ${keySkills.join(', ')}
- Career Direction: ${careerGoals}

Produce a visually stunning, content-rich resume that will impress both ATS systems and hiring managers.`;

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
          temperature: 0.4,
          maxOutputTokens: 8000,
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