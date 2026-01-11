import { GoogleGenerativeAI } from '@google/generative-ai';

export type Project = {
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Beginner' | 'Intermediate' | 'Advanced'; // Keeping old types for compatibility
    time: string;
    description: string;
    whySuggested?: string;
    skillsGained?: string[];
    tools: string[];
    steps: string[];
};

export type AnalysisResult = {
    name: string;
    model: string;
    year: string;
    status: string;
    projects: Project[];
};

export type ScanData = AnalysisResult & {
    id?: string;
    image: string;
};

export class GeminiService {
    private genAI: GoogleGenerativeAI;

    constructor(apiKey: string) {
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    async analyzeImage(imageBase64: string, additionalInfo?: string, userProfile?: { occupation: string; year?: string; resumeText: string; skills: string[] }): Promise<AnalysisResult> {
        // Switching to 'gemini-flash-latest' as it is a stable alias and avoids quota issues with 2.0-flash
        const model = this.genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        const profileContext = userProfile ? `
        User Profile:
        - Occupation: ${userProfile.occupation}
        ${userProfile.year ? `- Year/Grade: ${userProfile.year}` : ''}
        - Resume/Skills Context: ${userProfile.resumeText}
        
        Tailor the project suggestions to this user's background. 
        - If they are a student, focus on learning fundamentals and academic value.
        - If they are a professional, focus on practical utility or advanced concepts.
        - Use the resume context to suggest projects that build upon their existing skills or help them develop new desired skills.
        ` : '';

        const prompt = `
      Analyze this image of old computer hardware. 
      Identify the item, its model (if visible or inferable), and approximate year of manufacture.
      
      ${profileContext}

      Then, suggest **9 creative and practical DIY projects** (3 Easy, 3 Medium, 3 Hard) to repurpose or modernize this specific hardware.
      
      ${additionalInfo ? `Additional context from user: ${additionalInfo}` : ''}

      CRITICAL INSTRUCTION: You are an expert technical tutor. Your goal is to educate the user.
      For the "steps" in each project:
      1. Be extremely detailed. Don't just say "Install software", explain HOW and WHY.
      2. Use a clear, encouraging, and informative tone.
      3. Include specific commands or configuration details where applicable.
      4. Explain technical concepts briefly if they are complex.
      5. If a step involves code or terminal commands, include them clearly.

      Return the response in strictly valid JSON format with the following structure:
      {
        "name": "Item Name",
        "model": "Model Number/Name",
        "year": "YYYY",
        "status": "Project Found!",
        "projects": [
          {
            "title": "Project Title",
            "difficulty": "Easy", // Must be "Easy", "Medium", or "Hard"
            "time": "Estimated Time (e.g., 2 hours)",
            "description": "A short, catchy description of what this project achieves.",
            "whySuggested": "One sentence explaining why this fits the user's profile.",
            "skillsGained": ["Skill 1", "Skill 2", "Skill 3"],
            "tools": ["List", "of", "tools", "needed"],
            "steps": ["Step 1: Title - Detailed explanation...", "Step 2: Title - Detailed explanation..."]
          },
          // ... 8 more projects (3 Easy, 3 Medium, 3 Hard total)
        ]
      }
      
      Do not include markdown formatting (like \`\`\`json) in the response, just the raw JSON string.
    `;

        const imagePart = {
            inlineData: {
                data: imageBase64.split(',')[1],
                mimeType: 'image/jpeg', // Assuming JPEG for simplicity, but could be dynamic
            },
        };

        try {
            const result = await model.generateContent([prompt, imagePart]);
            const response = await result.response;
            const text = response.text();

            // Clean up any potential markdown formatting if the model adds it despite instructions
            const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();

            return JSON.parse(cleanText) as AnalysisResult;
        } catch (error: any) {
            console.error('Error analyzing image with Gemini:', error);

            if (error.message?.includes('429') || error.status === 429) {
                throw new Error('API Quota Exceeded. Please check your plan or try again later.');
            }

            // Pass the original error message if it's specific, otherwise generic
            throw new Error(error.message || 'Failed to analyze image. Please check your API key and try again.');
        }
    }
}
