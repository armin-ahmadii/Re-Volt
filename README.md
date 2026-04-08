# Re-Volt

**E-Waste Repurposing Platform**

Re-Volt is a web application designed to help reduce e-waste by identifying old hardware and suggesting DIY repurposing projects. Powered by the **Google Gemini API**, it analyzes hardware images and generates tailored, step-by-step project guides.

![Re-Volt Screenshot](https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2000&auto=format&fit=crop)

## Features

- **Hardware Identification**: Upload an image to identify components (model, year, specs).
- **AI-Generated Projects**: Get curated project ideas tailored to your skill level.
- **Step-by-Step Guides**: Comprehensive instructions including required tools and software commands.
- **Personalized Learning**: Onboarding flow tailored to your occupation and interests.
- **Secure & Local**: Your API key is stored locally in your browser.

## Tech Stack

- Frontend: React + Vite
- Styling: Tailwind CSS
- AI: Google Gemini API
- Icons: Lucide React
- Notifications: Sonner

## Getting Started

### Prerequisites

- Node.js (v18+)
- Google Gemini API Key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/armin-ahmadii/re-volt.git
   cd re-volt
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter your occupation and interests during onboarding.
2. Enter your Gemini API Key in the settings.
3. Upload an image of a computer part.
4. Browse suggested projects or request alternatives.
5. Select a project to view the full guide.

