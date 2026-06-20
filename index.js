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
