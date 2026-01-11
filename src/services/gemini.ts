import { GoogleGenerativeAI } from '@google/generative-ai';

export type Project = {
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Beginner' | 'Intermediate' | 'Advanced'; // Keeping old types for compatibility
    time: string;
    description: string;
    whySuggested?: string;
    skillsGained?: string[];
    tutorialVideos?: { title: string; channel: string }[]; // Specific highly-rated videos
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

    async identifyHardware(imageBase64: string, additionalInfo?: string): Promise<AnalysisResult> {
        const model = this.genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        const prompt = `
      Analyze this image of computer hardware. 
      Identify the item, its model (if visible or inferable), and approximate year of manufacture.
      
      ${additionalInfo ? `Additional context from user: ${additionalInfo}` : ''}

      Return the response in strictly valid JSON format:
      {
        "name": "Item Name",
        "model": "Model Number/Name",
        "year": "YYYY",
        "status": "Identified",
        "projects": [] 
      }
      `;

        const imagePart = {
            inlineData: {
                data: imageBase64.split(',')[1],
                mimeType: 'image/jpeg',
            },
        };

        try {
            const result = await model.generateContent([prompt, imagePart]);
            const response = await result.response;
            const text = response.text().replace(/```json\n?|\n?```/g, '').trim();
            return JSON.parse(text) as AnalysisResult;
        } catch (error: any) {
            console.error('Error identifying hardware:', error);
            if (error.message?.includes('429') || error.status === 429) {
                throw new Error('API Quota Exceeded. Please check your plan or try again later.');
            }
            throw new Error(error.message || 'Failed to identify hardware.');
        }
    }

    async suggestProjects(
        hardwareName: string,
        hardwareModel: string,
        userProfile?: { occupation: string; year?: string; resumeText: string; skills: string[] },
        difficulty?: string,
        count: number = 3
    ): Promise<Project[]> {
        const model = this.genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

        const profileContext = userProfile ? `
        User Profile:
        - Occupation: ${userProfile.occupation}
        ${userProfile.year ? `- Year/Grade: ${userProfile.year}` : ''}
        - Resume/Skills Context: ${userProfile.resumeText}
        
        Tailor the project suggestions to this user's background.
        ` : '';

        const difficultyContext = difficulty ? `Generate ${count} ${difficulty} projects.` : `Generate ${count} projects (1 Easy, 1 Medium, 1 Hard).`;

        const prompt = `
      I have a piece of hardware: ${hardwareName} (${hardwareModel}).
      
      ${profileContext}

      Suggest creative and practical DIY projects to repurpose this.
      ${difficultyContext}
      
      For each project, identify **3 specific, highly-rated YouTube tutorials**.
      Provide the **exact video title** and the **channel name**.
      
      CRITICAL:
      1. Steps must be DETAILED and BEGINNER-FRIENDLY.
      2. Explain "how" to do it, not just "what" to do (e.g., instead of "Install OS", say "Download the Batocera image, use BalenaEtcher to flash it to a USB drive, and boot from USB").
      3. Return strictly valid JSON array of projects.
      
      Structure:
      [
          {
            "title": "Project Title",
            "difficulty": "Easy", // or Medium, Hard
            "time": "Estimated Time",
            "description": "Short description",
            "whySuggested": "Reason",
            "skillsGained": ["Skill 1"],
            "tutorialVideos": [{"title": "T", "channel": "C"}],
            "tools": ["Tool 1"],
            "steps": ["Step 1 summary", "Step 2 summary"]
          }
      ]
      `;

        try {
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text().replace(/```json\n?|\n?```/g, '').trim();
            const parsed = JSON.parse(text);

            if (Array.isArray(parsed)) {
                return parsed as Project[];
            } else if (parsed && Array.isArray(parsed.projects)) {
                return parsed.projects as Project[];
            }

            console.error("Unexpected JSON structure:", parsed);
            return [];
        } catch (error) {
            console.error("Error suggesting projects:", error);
            return [];
        }
    }

    // Keeping for backward compatibility or direct calls if needed, but routing to new methods recommended
    async analyzeImage(imageBase64: string, additionalInfo?: string, userProfile?: any): Promise<AnalysisResult> {
        const hardware = await this.identifyHardware(imageBase64, additionalInfo);
        const projects = await this.suggestProjects(hardware.name, hardware.model, userProfile);
        return { ...hardware, projects };
    }
}
