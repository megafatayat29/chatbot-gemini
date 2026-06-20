import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import fs from 'fs';

const app = express();

// Buat folder uploads jika belum ada
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Konfigurasi multer untuk simpan ke disk
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const GEMINI_MODEL = "gemini-2.5-flash";

// System Prompt untuk Guru Bahasa Inggris
const ENGLISH_TEACHER_PROMPT = `You are an experienced and friendly English language teacher. Your role is to:
- Teach English grammar, vocabulary, pronunciation, and conversation skills
- Provide clear and engaging explanations with examples
- Correct mistakes patiently and explain why they're wrong
- Use real-world examples to illustrate concepts
- Encourage students and provide constructive feedback
- Adapt your teaching style to different proficiency levels (Beginner, Intermediate, Advanced)
- Respond primarily in English but can use Indonesian for clarity when needed
- Be patient, supportive, and make learning fun
- Ask follow-up questions to ensure understanding

Always introduce yourself and ask about the student's English level when starting a new conversation.`;

// Helper function untuk memanggil API dengan system prompt
const callGeminiWithTeacher = async (userPrompt, includeSystemPrompt = true) => {
  const fullPrompt = includeSystemPrompt 
    ? `${ENGLISH_TEACHER_PROMPT}\n\nStudent: ${userPrompt}`
    : userPrompt;

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: fullPrompt,
  });
  
  return response.text;
};

app.use(express.json());

const PORT = 3000;
app.listen(PORT, () => console.log(`Server ready on http://localhost:${PORT}`));

app.post('/generate-text', upload.none(), async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    res.status(200).json({ result: response.text });
  } catch (e) {
    console.log('Error generating text:', e);
    res.status(500).json({ message: e.message || 'Error generating text' });
  }
});

app.post('/generate-from-image', upload.single('image'), async (req, res) => {
  const { prompt } = req.body;
  const base64Image = req.file.buffer.toString('base64');

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          text: prompt,
          type: 'text',
        },
        {
          type: 'image',
          inlineData: { data: base64Image, mimeType: req.file.mimetype },
        },
      ],
    });
    res.status(200).json({ result: response.text });
  } catch (e) {
    console.log('Error generating content from image:', e);
    res.status(500).json({ message: e.message || 'Error generating content from image' });
  }
});

app.post('/generate-from-document', upload.single('document'), async (req, res) => {
  const { prompt } = req.body;
  const base64Document = req.file.buffer.toString('base64');

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          text: prompt ?? 'Tolong buat ringkasan dari dokumen berikut.',
          type: 'text',
        },
        {
          type: 'document',
          inlineData: { data: base64Document, mimeType: req.file.mimetype },
        },
      ],
    });
    res.status(200).json({ result: response.text });
  } catch (e) {
    console.log('Error generating content from document:', e);
    res.status(500).json({ message: e.message || 'Error generating content from document' });
  }
});

app.post('/generate-from-audio', upload.single('audio'), async (req, res) => {
  const { prompt } = req.body;
  const base64Audio = req.file.buffer.toString('base64');

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [
        {
          text: prompt ?? 'Tolong buat transkrip dari audio berikut.',
          type: 'text',
        },
        {
          type: 'audio',
          inlineData: { data: base64Audio, mimeType: req.file.mimetype },
        },
      ],
    });
    res.status(200).json({ result: response.text });
  } catch (e) {
    console.log('Error generating content from audio:', e);
    res.status(500).json({ message: e.message || 'Error generating content from audio' });
  }
});

// ============== ENGLISH TEACHER ENDPOINTS ==============

// Endpoint: Check Grammar - Perbaiki dan jelaskan kesalahan grammar
app.post('/check-grammar', express.json(), async (req, res) => {
  const { text, studentLevel = 'Intermediate' } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Text field is required' });
  }

  try {
    const prompt = `Student Level: ${studentLevel}

Please check this English text and:
1. Identify any grammar mistakes
2. Explain why it's wrong
3. Provide the correct version
4. Give similar examples for learning
5. Rate the overall grammar quality (Good/Fair/Needs Work)

Text to check: "${text}"

Format your response clearly with each section numbered.`;

    const result = await callGeminiWithTeacher(prompt);
    res.status(200).json({ result });
  } catch (e) {
    console.log('Error checking grammar:', e);
    res.status(500).json({ message: e.message || 'Error checking grammar' });
  }
});

// Endpoint: Vocabulary Lesson - Ajarkan vocabulary baru
app.post('/vocabulary-lesson', express.json(), async (req, res) => {
  const { word, context = '', studentLevel = 'Intermediate' } = req.body;

  if (!word) {
    return res.status(400).json({ message: 'Word field is required' });
  }

  try {
    const prompt = `Student Level: ${studentLevel}

Please teach the word/phrase: "${word}"
${context ? `Context: ${context}` : ''}

Include in your lesson:
1. Definition and meaning
2. Pronunciation guide (phonetic)
3. Part of speech
4. Example sentences (3-5 examples)
5. Synonyms and antonyms
6. Common phrases or expressions using this word
7. Tips for remembering this word
8. Similar words to compare with

Make it engaging and easy to understand.`;

    const result = await callGeminiWithTeacher(prompt);
    res.status(200).json({ result });
  } catch (e) {
    console.log('Error creating vocabulary lesson:', e);
    res.status(500).json({ message: e.message || 'Error creating vocabulary lesson' });
  }
});

// Endpoint: Pronunciation Guide - Panduan pronunciation
app.post('/pronunciation-guide', express.json(), async (req, res) => {
  const { words, studentLevel = 'Beginner' } = req.body;

  if (!words || words.length === 0) {
    return res.status(400).json({ message: 'Words array is required' });
  }

  try {
    const wordList = Array.isArray(words) ? words.join(', ') : words;
    const prompt = `Student Level: ${studentLevel}

Please provide pronunciation guides for these words: ${wordList}

For each word, include:
1. Phonetic spelling (using English phonetics)
2. IPA (International Phonetic Alphabet) if available
3. Syllable breakdown
4. Stress pattern (which syllable to emphasize)
5. Audio tips (how to pronounce difficult sounds)
6. Common mistakes in pronunciation
7. Related words with similar pronunciation

Make the guide beginner-friendly with clear explanations.`;

    const result = await callGeminiWithTeacher(prompt);
    res.status(200).json({ result });
  } catch (e) {
    console.log('Error creating pronunciation guide:', e);
    res.status(500).json({ message: e.message || 'Error creating pronunciation guide' });
  }
});

// Endpoint: Conversation Practice - Latih percakapan
app.post('/conversation-practice', express.json(), async (req, res) => {
  const { topic, studentLevel = 'Intermediate', userMessage = '' } = req.body;

  if (!topic) {
    return res.status(400).json({ message: 'Topic field is required' });
  }

  try {
    let prompt = `Student Level: ${studentLevel}
Topic: ${topic}

${userMessage ? `Student said: "${userMessage}"` : ''}

Please help with conversation practice:
${userMessage ? `
1. Respond naturally to what the student said
2. Correct any grammar mistakes gently
3. Ask a follow-up question to continue the conversation
4. Provide an alternative, more natural way to express the same idea
` : `
1. Start a natural conversation about the topic
2. Ask an opening question
3. Provide 2-3 example responses they could give
4. Explain useful phrases for this topic
`}

Keep the response conversational, friendly, and encouraging!`;

    const result = await callGeminiWithTeacher(prompt);
    res.status(200).json({ result });
  } catch (e) {
    console.log('Error creating conversation practice:', e);
    res.status(500).json({ message: e.message || 'Error creating conversation practice' });
  }
});

// Endpoint: Quiz - Buat kuis pembelajaran
app.post('/quiz', express.json(), async (req, res) => {
  const { topic, questionCount = 5, studentLevel = 'Intermediate', type = 'multiple-choice' } = req.body;

  if (!topic) {
    return res.status(400).json({ message: 'Topic field is required' });
  }

  try {
    const prompt = `Student Level: ${studentLevel}
Topic: ${topic}
Question Type: ${type}
Number of Questions: ${questionCount}

Please create a fun and educational English quiz with:
1. ${questionCount} questions about ${topic}
2. Question format: ${type} (options: multiple-choice, true-false, fill-the-blank, short-answer)
3. Include:
   - Clear questions
   - ${type === 'multiple-choice' ? 'A) B) C) D) options with one correct answer' : 'Blank space to fill or short answer expected'}
   - Difficulty appropriately set for ${studentLevel} level
   - Mix of grammar, vocabulary, and comprehension

After the quiz, include:
- Answer key with explanations
- Learning tips related to the questions
- Suggestions for improvement`;

    const result = await callGeminiWithTeacher(prompt);
    res.status(200).json({ result });
  } catch (e) {
    console.log('Error creating quiz:', e);
    res.status(500).json({ message: e.message || 'Error creating quiz' });
  }
});
