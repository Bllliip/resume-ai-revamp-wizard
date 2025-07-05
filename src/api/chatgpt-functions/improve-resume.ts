export interface ImproveResumeRequest {
  targetRole: string;
  industry: string;
  experienceLevel: string;
  keySkills: string[];
  careerGoals: string;
  originalResume: string;
}

export interface ImproveResumeResponse {
  improvedResume: string;
  warnings?: string[];
}

export const improveResumeWithChatGPT = async (requestData: ImproveResumeRequest): Promise<ImproveResumeResponse> => {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY || localStorage.getItem('openai_api_key');
  
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is required');
  }

  // Validate input
  if (!requestData.originalResume || requestData.originalResume.trim().length < 100) {
    throw new Error('Original resume is required and must be at least 100 characters long');
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

TARGET ROLE: ${requestData.targetRole || 'Not specified'}
INDUSTRY: ${requestData.industry || 'Not specified'}
EXPERIENCE LEVEL: ${requestData.experienceLevel || 'Not specified'}
KEY SKILLS TO HIGHLIGHT: ${requestData.keySkills?.join(', ') || 'None specified'}
CAREER GOALS: ${requestData.careerGoals || 'Not specified'}

ORIGINAL RESUME TO IMPROVE:
${requestData.originalResume}

INSTRUCTIONS:
- Enhance clarity, grammar, and professional tone
- Improve action verbs and impact statements where appropriate
- Optimize for ATS (Applicant Tracking System) compatibility
- Maintain the original structure and all factual information
- Use the target role and industry context to guide improvements
- If targeting "${requestData.targetRole}" in "${requestData.industry}", ensure language aligns with that field
- DO NOT add any information not present in the original resume
- DO NOT change any facts, dates, companies, or experiences

Return only the improved resume text without additional commentary.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
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
  const originalLength = requestData.originalResume.length;
  const improvedLength = improvedResume.length;
  
  // If the improved version is drastically different in length, it might be hallucinated
  const warnings: string[] = [];
  if (improvedLength < originalLength * 0.5 || improvedLength > originalLength * 2) {
    console.warn('Improved resume length significantly different from original', {
      originalLength,
      improvedLength
    });
    warnings.push('Improved resume is significantly different in length from original - please review carefully');
  }

  return {
    improvedResume,
    warnings
  };
};