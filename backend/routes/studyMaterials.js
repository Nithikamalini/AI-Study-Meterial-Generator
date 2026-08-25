const express = require('express');
const router = express.Router();
const Document = require('../models/Document');
const StudyMaterial = require('../models/StudyMaterial');
const { protect } = require('../middleware/auth');
const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Helper to construct prompt based on material type
const getPrompt = (type, text) => {
  const basePrompt = `Based on the following text, please generate ${type}.\n\nText:\n${text}\n\n`;
  
  switch(type) {
    case 'summary':
      return basePrompt + "Provide a comprehensive but concise summary of the key points.";
    case 'mcqs':
      return basePrompt + "Generate 5 multiple choice questions. Format the output as a JSON array of objects, where each object has 'question' (string), 'options' (array of 4 strings), and 'correctAnswer' (string, matching one of the options). Do not include markdown formatting or backticks around the JSON.";
    case 'flashcards':
      return basePrompt + "Generate 10 flashcards for key concepts. Format the output as a JSON array of objects, where each object has 'front' (concept) and 'back' (definition/explanation). Do not include markdown formatting or backticks around the JSON.";
    case 'short-questions':
      return basePrompt + "Generate 5 short answer questions with their answers. Format as JSON array with 'question' and 'answer'. Do not include markdown formatting.";
    case 'long-questions':
      return basePrompt + "Generate 3 long answer/essay questions with detailed model answers. Format as JSON array with 'question' and 'answer'. Do not include markdown formatting.";
    case 'important-topics':
      return basePrompt + "Extract the most important topics from the text. Format as JSON array of strings. Do not include markdown formatting.";
    case 'quiz':
      return basePrompt + "Generate a 5-question quiz with multiple choice answers. Format as JSON array with 'question', 'options' (array of 4 strings), 'correctAnswer' (string), and 'explanation' (string explaining why it's correct). Do not include markdown formatting.";
    default:
      return basePrompt;
  }
}

// Helper for fallback mock data
const getMockContent = (type, documentName) => {
  const cleanName = documentName ? documentName.replace('.pdf', '') : 'Document';
  
  switch(type) {
    case 'summary':
      return `This is a simulated summary for the document "${cleanName}".\n\n1. Overview: The document details key theories and implementations related to the core subject matter. It highlights fundamental principles, practical applications, and common challenges.\n\n2. Key Findings: Main takeaways indicate a strong correlation between foundational theory and actual development workflows. Standard methodologies should be applied to maximize efficiency and minimize runtime complexity.\n\n3. Conclusion: Advancements in this domain continue to streamline development, making it an essential topic of study for engineering students and industry practitioners alike.`;
      
    case 'mcqs':
      return [
        {
          question: `What is the primary focus of "${cleanName}"?`,
          options: ["Core foundational theories", "Historical context only", "Visual arts appreciation", "None of the above"],
          correctAnswer: "Core foundational theories"
        },
        {
          question: "Which of the following is considered a best practice in this field?",
          options: ["Ignoring error states", "Iterative design and testing", "Using legacy systems blindly", "Hardcoding all configurations"],
          correctAnswer: "Iterative design and testing"
        },
        {
          question: "What is the typical outcome of failing to configure environment variables properly?",
          options: ["Application connects to default database", "Runtime crashes or connection errors", "Code compiles faster", "No noticeable difference"],
          correctAnswer: "Runtime crashes or connection errors"
        },
        {
          question: "In standard architectures, what layer is responsible for database interaction?",
          options: ["Frontend routing", "Client-side state management", "Backend ORM / Models", "CSS stylesheets"],
          correctAnswer: "Backend ORM / Models"
        },
        {
          question: "Why are RESTful APIs typically used in modern web applications?",
          options: ["To separate frontend layout from backend database services", "To style components automatically", "To encrypt client-side files", "To replace database indexing"],
          correctAnswer: "To separate frontend layout from backend database services"
        }
      ];
      
    case 'flashcards':
      return [
        { front: "Authentication (AuthN)", back: "The process of verifying who a user is (e.g. via username/password or JWT)." },
        { front: "Authorization (AuthZ)", back: "The process of verifying what specific files or resources a verified user has access to." },
        { front: "ORM (Object-Relational Mapping)", back: "A technique that lets you query and manipulate data from a database using an object-oriented paradigm (e.g., Mongoose for MongoDB)." },
        { front: "Generative AI", back: "AI models trained to generate new content, such as text, images, or code, based on prompt inputs." },
        { front: "JWT (JSON Web Token)", back: "A compact, URL-safe means of representing claims to be transferred between two parties, commonly used for stateless session authentication." },
        { front: "Vite", back: "A modern, ultra-fast frontend build tool and dev server typically used for React applications." }
      ];
      
    case 'short-questions':
      return [
        { question: "What is the role of middleware in Express.js?", answer: "Middleware functions have access to the request object (req), response object (res), and the next function. They can execute code, modify request/response objects, end request-response cycles, and call the next middleware." },
        { question: "Why is password hashing necessary before saving to a database?", answer: "Hashing converts passwords into an irreversible string of characters to protect user security in case of database leaks. Plaintext passwords should never be stored." },
        { question: "What is the purpose of Multer in this project?", answer: "Multer is a Node.js middleware for handling multipart/form-data, primarily used for uploading files like the student's study PDFs." },
        { question: "What does stateless authentication mean?", answer: "It means the server does not store session information on its memory. Instead, the client sends a token (like a JWT) with every request, which the server validates on the fly." }
      ];
      
    case 'long-questions':
      return [
        {
          question: "Explain the complete request-response flow of this AI Study Material Generator.",
          answer: "The flow starts when a student uploads a PDF. The frontend sends it via multipart/form-data to the backend. Express intercepts it using Multer, extracts the text using pdf-parse, and saves the document record to MongoDB. When the user requests a study material (like a quiz), the backend retrieves the extracted text, constructs a specific prompt, passes it to the Gemini GenAI model, parses the response, saves the generated study material in MongoDB, and sends it back to the React frontend to display."
        },
        {
          question: "Describe the differences between SQL and NoSQL databases, referencing MongoDB.",
          answer: "SQL databases are relational, table-based, and require a predefined schema. NoSQL databases like MongoDB are non-relational, document-based (storing data in JSON-like BSON documents), and have dynamic schemas. MongoDB offers flexibility for unstructured data like parsed PDF text, which makes it ideal for dynamic GenAI applications."
        }
      ];
      
    case 'important-topics':
      return [
        "User Session Authentication and JWT Security",
        "Multipart File Upload Handlers (Multer)",
        "PDF Document Parsing and Text Processing",
        "Generative AI Prompt Engineering and Structured JSON outputs",
        "State Management and Dynamic Routing in React"
      ];
      
    case 'quiz':
      return [
        {
          question: "Which component extracts text from uploaded PDFs in this architecture?",
          options: ["Express router", "pdf-parse library", "Gemini API", "Tailwind CSS"],
          correctAnswer: "pdf-parse library",
          explanation: "The pdf-parse library extracts raw text from PDF file buffers on the backend before it gets passed to the AI."
        },
        {
          question: "How does the frontend securely access protected APIs?",
          options: ["Using plain text cookies", "Using JWT attached to the Authorization header", "By bypassing routing checks", "Using static session IDs"],
          correctAnswer: "Using JWT attached to the Authorization header",
          explanation: "Axios interceptors dynamically add the Bearer token to the request headers for secure APIs."
        },
        {
          question: "What is the purpose of the pre-save hook in the User schema?",
          options: ["To format usernames", "To automatically hash passwords before database entry", "To validate emails", "To trigger AI requests"],
          correctAnswer: "To automatically hash passwords before database entry",
          explanation: "Mongoose pre-save hooks intercept the user document before it writes to the DB to hash the password securely using bcrypt."
        }
      ];
    default:
      return "Mock content";
  }
}

// @desc    Generate study material
// @route   POST /api/study-materials/generate
// @access  Private
router.post('/generate', protect, async (req, res) => {
  try {
    const { documentId, type } = req.body;

    if (!documentId || !type) {
      return res.status(400).json({ message: 'Document ID and type are required' });
    }

    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    if (document.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const apiKey = process.env.GEMINI_API_KEY || 'dummy_key_please_replace';
    let generatedContent;

    if (apiKey === 'dummy_key_please_replace' || !apiKey) {
      // Return high-quality mock data matching the requested type
      generatedContent = getMockContent(type, document.filename);
    } else {
      const prompt = getPrompt(type, document.textContext);

      // Call Gemini API
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      generatedContent = response.text;
      
      // Parse JSON if it's supposed to be structured data
      if (type !== 'summary') {
        try {
          // Strip markdown blocks if they were accidentally included
          generatedContent = generatedContent.replace(/```json\n|\n```/g, '');
          generatedContent = JSON.parse(generatedContent);
        } catch (e) {
          console.error("Failed to parse AI output as JSON", e);
          // Fallback to string if parsing fails
        }
      }
    }

    // Save generated material
    const studyMaterial = await StudyMaterial.create({
      user: req.user._id,
      document: documentId,
      type: type,
      content: generatedContent
    });

    res.status(201).json(studyMaterial);
  } catch (error) {
    console.error('Error generating material:', error);
    res.status(500).json({ message: error.message || 'Error generating material' });
  }
});

// @desc    Get all study materials for a document
// @route   GET /api/study-materials/document/:documentId
// @access  Private
router.get('/document/:documentId', protect, async (req, res) => {
  try {
    const materials = await StudyMaterial.find({ 
      document: req.params.documentId,
      user: req.user._id
    }).sort({ createdAt: -1 });
    
    res.json(materials);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
