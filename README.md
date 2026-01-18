# Code Comparison

**Code Comparison** is a modern, lightweight, and dark-themed code comparison tool built with React. It provides developers with a clean interface to compare "Original" vs. "Modified" code snippets, visualizing changes with line-by-line accuracy.

## ✨ Features

* **Dual View Modes:** Toggle between **Split View** (Side-by-Side) and **Unified View** (Inline) for flexible code review.
* **Real-time Comparison:** Instantly computes diffs as you type or paste code (debounced for performance).
* **Drag & Drop Support:** Drag file files directly into the input areas to load content.
* **Visual Syntax Highlighting:**
* <span style="color:#34d399">Green</span> for additions/insertions.
* <span style="color:#f87171">Red</span> for deletions/removals.


* **Change Statistics:** Live counter for total additions and deletions.
* **Line Numbering:** Accurate line tracking for both original and generated code.
* **Dark Mode UI:** A polished, eye-friendly Slate/Indigo dark theme designed for long coding sessions.

## 🛠 Tech Stack

* **Framework:** React
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Diff Logic:** [jsdiff](https://github.com/kpdecker/jsdiff) (Loaded dynamically via CDN)

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1. Prerequisites

Ensure you have Node.js installed on your machine.

### 2. Create a React Project (with Vite & Tailwind)

The easiest way to run this app is using Vite with Tailwind CSS pre-configured.

```bash
# Create project
npm create vite@latest CodeComparison -- --template react
cd diffcheck-pro

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

```

### 3. Configure Tailwind

Open `tailwind.config.js` and ensure the content paths are set so the styles work:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

```

Add the Tailwind directives to your `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

```

### 4. Install Dependencies

Install the required icon library:

```bash
npm install lucide-react

```

*(Note: `jsdiff` does not need to be installed via npm as the component loads it dynamically from a CDN for browser compatibility).*

### 5. Add the Components

Create the file structure as shown below and copy the provided code into the respective files.

```text
src/
├── components/
│   ├── DiffTool.jsx         <-- Main component
│   ├── SplitDiffView.jsx    <-- Sub-component
│   └── UnifiedDiffView.jsx  <-- Sub-component
├── App.jsx
└── main.jsx

```

### 6. Run the App

Import `DiffTool` into your main `App.jsx` and run the development server:

```jsx
// src/App.jsx
import DiffTool from './components/DiffTool';

function App() {
  return <DiffTool />;
}

export default App;

```

Run the command:

```bash
npm run dev

```

## 📂 Project Structure

```
├── src/
│   ├── components/
│   │   ├── DiffTool.jsx          # Main logic, state management, and file handling
│   │   ├── SplitDiffView.jsx     # Logic for aligning side-by-side rows
│   │   └── UnifiedDiffView.jsx   # Logic for single-column rendering
│   └── ...

```

## 🧩 How It Works

1. **Library Loading:** On mount, `DiffTool.jsx` injects a script tag to load `jsdiff` from a CDN. This allows the diffing logic to run entirely client-side without heavy bundling.
2. **Diff Computation:** When code changes, the app uses `Diff.diffLines()` to generate a change object.
3. **Parsing:**
* **Unified View** maps the changes linearly.
* **Split View** uses a custom algorithm to align "Removals" on the left with "Additions" on the right to keep context lines parallel.



## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
