# AirPaint 🖐️🎨

**AirPaint** is an experimental, AI-powered spatial interface that allows you to interact with your computer using hand gestures. Built with **React**, **Three.js**, and **Google MediaPipe**, it transforms your webcam into a high-fidelity input device for generative art and digital interaction.

## ✨ Core Features

-   **Spatial Painting**: Draw in 3D space by simply pointing your finger at the screen.
-   **Gesture-Driven UI**: 
    -   **Point**: Draw/Interact.
    -   **Pinch**: Dynamic brush resizing (distance between thumb and index).
    -   **Fist**: Undo last action.
    -   **Swipe**: Clear canvas.
-   **Neural-Link HUD**: Real-time feedback on hand tracking stability and current gesture processing.
-   **Immersive Aesthetic**: A bioluminescent, cybernetic visual style with glassmorphism and reactive shaders.

## 🚀 Live Demo

Experience AirPaint directly in your browser:
[https://notdevank.github.io/AirPaint/](https://notdevank.github.io/AirPaint/)

## 🛠️ Technology Stack

-   **Hand Tracking**: [Google MediaPipe](https://developers.google.com/mediapipe) (Hand Landmarker)
-   **Framework**: [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
-   **Animation**: [Framer Motion](https://www.framer.com/motion/)
-   **Icons**: [Lucide React](https://lucide.dev/)
-   **Build Tool**: [Vite](https://vitejs.dev/)

## 💻 Local Development

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/notdevank/AirPaint.git
    cd AirPaint
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the engine**:
    ```bash
    npm run dev
    ```

4.  **Production build**:
    ```bash
    npm run build
    ```

## 📜 Project Structure

-   `src/components/`: Core components like `HandTracker`, `AirPaint`, and `GestureCursor`.
-   `src/hooks/`: `useHandGestures` logic for processing MediaPipe landmarks.
-   `.github/workflows/`: Automated CI/CD pipeline for GitHub Pages.

---
Developed as part of the **Obsidialith** project. Created by [notdevank](https://github.com/notdevank).
