# AI Study Material Generator

![AI Study Material Generator](https://via.placeholder.com/1200x600?text=AI+Study+Material+Generator)

A full-stack web application designed to help students automatically generate study materials from their PDF notes using Generative AI. 

This project was built for a B.Tech IT final-year/placement portfolio, demonstrating proficiency in the MERN stack and AI API integrations.

## 🎯 Features

- **User Authentication:** Secure registration and login using JWT.
- **Document Upload:** Upload PDF documents which are parsed and stored in the database.
- **AI Material Generation:** Powered by the Gemini API, students can generate:
  - 📖 Summaries
  - ❓ Multiple Choice Questions (MCQs)
  - 🧠 Interactive Flashcards
  - ✍️ Short & Long Answer Questions
  - 🔑 Important Topics
- **Interactive UI:** Beautiful, responsive UI built with React and Tailwind CSS, featuring hover-to-reveal flashcards and structured quiz layouts.
- **Study Dashboard:** Keep track of all uploaded documents and generated materials.

## 🛠️ Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS, React Router, Lucide Icons
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **AI & Processing:** `@google/genai` (Gemini API), `pdf-parse`, `multer`
- **Security:** `bcrypt`, `jsonwebtoken`

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB installed locally or a MongoDB Atlas cluster URL
- A Google Gemini API Key

### Installation

1. **Clone the repository** (if applicable) and navigate to the project directory.

2. **Setup the Backend:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory based on `.env.example`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/ai-study-material
   JWT_SECRET=your_super_secret_jwt_key
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Setup the Frontend:**
   ```bash
   cd frontend
   npm install
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```

4. **Access the App:** Open your browser and navigate to `http://localhost:5173` (or the port Vite provides).

## 💡 Future Enhancements

- **Quiz Module:** Implement a scoring system where users can take the generated MCQs interactively and get a score.
- **Cloud Storage:** Switch from memory storage to AWS S3 or Cloudinary for persistent PDF storage.
- **Export Options:** Allow users to download generated study materials as PDF or Word documents.

---
