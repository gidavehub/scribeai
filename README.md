# Developer Note (Important — Please Read)

I built this entire prototype without owning a smartphone. I developed **Scribe AI** using my laptop and Expo's web option because running an Android/iOS emulator would immediately shut down my machine — my laptop only has **3GB RAM** and cannot handle emulator/resource-heavy builds. The phone you see in the demo video is a neighbor’s device I begged to borrow for a quick test and recording.

---

### Personal Background
- Graduated high school about **3 years ago**.  
- Originally from **Nigeria (West Africa)**, currently live in **The Gambia**.  
- No sponsorship for college; I’ve been hustling and building where I can.  
- Developed this project entirely on a **3GB RAM laptop** using Expo web workflow.  
- The phone in the demo was **borrowed** from a neighbor only for testing.  

I am a very gifted developer and mathematician and this project is just the beginning. Please give me a shot.  
I truly need this **prize money** to get proper equipment (a modern laptop and a phone) and continue building.  
With the right hardware and continued support, I will turn **Scribe AI** into a polished product that will blow your minds. 

-------------------------------------------------------------------------------------------------------------------------------------------------------------------

# ✍️ Scribe AI

An interactive AI tutor that visually solves complex problems on a digital whiteboard. Scribe AI transforms static equations and text into dynamic, animated explanations with a fluid, handwritten effect, complete with spoken guidance.

![Scribe AI Demo GIF](https://your-image-hosting-service.com/scribe-ai-demo.gif)
*(**Note:** You should record a GIF of your app in action and replace the URL above.)*

---

## ✨ Core Concept

The traditional way of learning complex subjects often involves staring at static problems in a textbook. It can be difficult to follow the logic and understand the flow of a solution.

**Scribe AI** solves this by acting as a personal AI tutor on a digital whiteboard. You can type a problem or simply **snap a picture of one from your textbook**. The AI doesn't just return an answer—it generates a step-by-step **visual script**. Our custom rendering engine then animates this script, drawing out each equation and diagram while a **clear voice explains each step**, making the solution intuitive and easy to follow.

## 🚀 Features

*   **AI-Powered Solutions:** Leverages the Google Gemini API to understand problems and generate step-by-step logical solutions.
*   **Camera & Image Input:** Snap a photo of a math problem from a textbook or whiteboard, and the AI's vision capabilities will analyze it directly.
*   **Text-to-Speech Explanations:** As each step of the solution is drawn, a clear voice reads the explanation aloud, creating a multi-sensory learning experience.
*   **Step-by-Step Animated Drawing:** Renders solutions with a dynamic, handwritten effect, drawing each character and symbol sequentially.
*   **Handles Complex Content:** Capable of drawing equations, explanatory text, diagrams, and schematics.
*   **Extensible Architecture:** The AI communicates with the app via a simple JSON "scripting language," making it easy to add new drawing and speech capabilities.

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React Native (Expo)** | Cross-platform mobile app development |
| **TypeScript** | For robust, type-safe code |
| **Google Gemini API** | AI-powered reasoning and vision analysis |
| **React Native SVG** | Core library for rendering vector graphics |
| **React Native Reanimated** | For smooth, performant, 60 FPS animations |
| **Expo Router** | File-based routing for app navigation |
| **Expo Camera / Image Picker**| Image & Camera Handling |
| **Expo Speech** | Text-to-Speech Synthesis |

## ⚙️ How It Works

The magic of Scribe AI is in its simple yet powerful five-step pipeline:

1.  **User Input:** The user either types a problem or uses the camera to capture an image of one.
2.  **AI Vision & Generation:** If an image is provided, it's sent to the Gemini API for vision analysis to extract the text and context. This extracted problem is then used in a carefully engineered prompt that instructs the AI to generate a step-by-step solution as a JSON array of commands.
3.  **JSON Scripting:** The app receives a script like this:
    ```json
    [
      {"command": "drawEquation", "payload": {"equation": "2x+5=11", ...}},
      {"command": "pause", "payload": {"duration": 500}},
      {"command": "drawText", "payload": {"text": "Subtract 5 from both sides", ...}}
    ]
    ```
4.  **Parsing:** A parser converts these high-level commands into low-level SVG path strings and speech instructions.
5.  **Animation & Speech Synthesis:** The `DrawingOrchestrator` component takes this list of instructions and animates each path sequentially on the screen. As each `drawText` command is processed, its content is also sent to the device's text-to-speech engine to be spoken aloud, perfectly synced with the animation.

## 🏁 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (LTS version recommended)
*   `npm` or `yarn`
*   The [Expo Go](https://expo.dev/go) app on your iOS or Android device.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/scribe-ai.git
    cd scribe-ai
    ```

2.  **Install NPM packages:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    *   You will need a Google Gemini API Key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   For this hackathon project, we are inputting it directly in the UI.

4.  **Run the application:**
    ```bash
    npx expo start
    ```
    If you encounter any caching issues, especially after installing new packages, run with the `--clear` flag:
    ```bash
    npx expo start -c
    ```

5.  Scan the QR code with the Expo Go app on your phone. You may need to grant camera permissions for the image upload feature to work.

## 🗺️ Roadmap & Future Work

Scribe AI is currently a proof-of-concept with a solid foundation. Here are some features we're excited to build next:

*   [ ] **Advanced Diagramming:** Add support for more complex shapes for physics (free-body diagrams) and calculus (graphs, integrals).
*   [ ] **Interactive Steps:** Allow users to tap on a specific step to get a more detailed explanation from the AI.
*   [ ] **Save & Export:** Save sessions or export the final drawing as an image or PDF.
*   [ ] **Color & Highlighting:** Add commands for changing colors to highlight specific parts of a diagram or equation.
*   [ ] **Multi-language Support:** Add support for different languages for both the AI and the text-to-speech engine.

## 📄 License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.
