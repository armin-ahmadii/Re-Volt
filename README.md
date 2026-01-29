# Re-Volt ⚡️

**Identify. Repurpose. Re-Volt.**

Re-Volt is a smart web application designed to help you reduce e-waste by identifying old computer hardware and suggesting creative, DIY repurposing projects. 
Powered by **Google Gemini AI**, it analyzes images of your hardware in real-time and generates tailored, step-by-step guides to give your old tech a new life.

![Re-Volt Screenshot](https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2000&auto=format&fit=crop)

## ✨ Features

-   **⚡️ Instant Hardware Identification**: Snap a photo or upload an image, and our AI instantly identifies the component (GPU, Motherboard, RAM, etc.), including model and year.
-   **🛠 AI-Generated DIY Projects**: Get 3 curated project ideas (Easy, Medium, Hard) based on your specific hardware and skill level.
-   **📚 Detailed Step-by-Step Guides**: comprehensive, beginner-friendly instructions including required tools, software commands, and tutorial links.
-   **🎓 Personalized Learning**: Onboarding flow tailored to your occupation (Student, Engineer, Hobbyist) to suggest relevant skills to learn.
-   **🔄 "Load More" Functionality**: Request more projects for a specific difficulty level without re-scanning.
-   **🔐 Secure & Local**: Your API key is stored locally in your browser.
-   **🎨 Cyberpunk/Terminal UI**: A beautiful, dark-mode interface inspired by modern developer aesthetics.

## 🛠 Tech Stack

-   **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **AI**: [Google Gemini API](https://ai.google.dev/) (`gemini-flash-latest` model)
-   **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

## 🚀 Getting Started

### Prerequisites

-   Node.js (v18 or higher)
-   npm or yarn
-   A [Google Gemini API Key](https://aistudio.google.com/app/apikey) (Free tier available)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/armin-ahmadii/re-volt.git
    cd re-volt
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```
30
4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

1.  **Onboarding**: Enter your occupation and interests so Re-Volt can tailor regular suggestions.
2.  **Settings**: Click the gear icon to enter your Gemini API Key.
3.  **Scan**: Upload an image of any computer part (e.g., an old GPU).
4.  **Review**: See the identified hardware details instantly.
5.  **Explore**: Browse suggested projects. Click "Load More" if you want alternatives.
6.  **Build**: Select a project to generate a full, deep-dive guide!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
