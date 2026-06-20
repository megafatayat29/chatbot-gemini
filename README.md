# Gemini Flash API Service: English Teacher

Service chatbot AI dengan kemampuan khusus sebagai **English Teacher** yang dilengkapi dengan fitur untuk belajar bahasa Inggris, serta kemampuan umum untuk memproses text, gambar, dokumen, dan audio.

## Fitur

- 🤖 **Generate Text** - Buat konten berbasis prompt text
- 🖼️ **Generate from Image** - Analisis gambar dan jawab pertanyaan tentangnya
- 📄 **Generate from Document** - Buat ringkasan atau analisis dokumen
- 🎵 **Generate from Audio** - Transkrip dan analisis audio

### English Teacher Features 🎓
- ✏️ **Check Grammar** - Perbaiki dan jelaskan kesalahan grammar
- 📚 **Vocabulary Lesson** - Belajar vocabulary baru dengan contoh
- 🗣️ **Pronunciation Guide** - Panduan pronunciation dengan phonetic & IPA
- 💬 **Conversation Practice** - Latihan percakapan interaktif
- 🧪 **Quiz** - Buat kuis pembelajaran dengan berbagai tipe soal

## Prerequisites

- Node.js v16 atau lebih tinggi
- npm atau yarn
- API Key dari Google Gemini (dapatkan di [Google AI Studio](https://aistudio.google.com/))

## Setup & Instalasi

### 1. Clone Repository
```bash
git clone <repository-url>
cd gemini-flash-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Buat file `.env` di root directory dengan konten berikut:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

Ganti `your_gemini_api_key_here` dengan API key Anda dari Google AI Studio.

### 4. Jalankan Server
```bash
node index.js
```

Server akan berjalan di `http://localhost:3000`

## Endpoints

### 1. POST /generate-text
Generate konten berbasis text prompt.

**Request Body (form-data atau JSON):**
```json
{
  "prompt": "Jelaskan tentang JavaScript"
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:3000/generate-text \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Jelaskan tentang JavaScript"
  }'
```

**Response:**
```json
{
  "result": "JavaScript adalah bahasa pemrograman..."
}
```

---

### 2. POST /generate-from-image
Generate konten berdasarkan text prompt dan image.

**Request:**
- `Content-Type`: multipart/form-data
- Form fields:
  - `prompt` (string) - Pertanyaan atau instruksi tentang image
  - `image` (file) - File gambar (jpg, png, webp, gif, dll)

**Example cURL:**
```bash
curl -X POST http://localhost:3000/generate-from-image \
  -F "prompt=Apa yang ada di gambar ini?" \
  -F "image=@/path/to/image.jpg"
```

**Response:**
```json
{
  "result": "Dalam gambar ini terlihat..."
}
```

---

### 3. POST /generate-from-document
Generate konten berdasarkan text prompt dan dokumen.

**Request:**
- `Content-Type`: multipart/form-data
- Form fields:
  - `prompt` (string, optional) - Pertanyaan atau instruksi tentang dokumen. Jika kosong, default: "Tolong buat ringkasan dari dokumen berikut."
  - `document` (file) - File dokumen (pdf, txt, docx, dll)

**Example cURL:**
```bash
curl -X POST http://localhost:3000/generate-from-document \
  -F "prompt=Buat ringkasan singkat dari dokumen ini" \
  -F "document=@/path/to/document.pdf"
```

**Response:**
```json
{
  "result": "Ringkasan dokumen: ..."
}
```

---

### 4. POST /generate-from-audio
Generate konten berdasarkan text prompt dan audio.

**Request:**
- `Content-Type`: multipart/form-data
- Form fields:
  - `prompt` (string, optional) - Pertanyaan atau instruksi tentang audio. Jika kosong, default: "Tolong buat transkrip dari audio berikut."
  - `audio` (file) - File audio (mp3, wav, m4a, dll)

**Example cURL:**
```bash
curl -X POST http://localhost:3000/generate-from-audio \
  -F "prompt=Buat transkrip dari audio ini" \
  -F "audio=@/path/to/audio.mp3"
```

**Response:**
```json
{
  "result": "Transkrip: ..."
}
```

---

## English Teacher Endpoints 🎓

### 1. POST /check-grammar
Periksa, perbaiki, dan dapatkan penjelasan detail tentang grammar.

**Request Body (JSON):**
```json
{
  "text": "She go to school yesterday",
  "studentLevel": "Beginner"
}
```

**Parameters:**
- `text` (string, required) - Teks yang ingin diperiksa
- `studentLevel` (string, optional) - Level siswa: "Beginner", "Intermediate", "Advanced" (default: "Intermediate")

**Example cURL:**
```bash
curl -X POST http://localhost:3000/check-grammar \
  -H "Content-Type: application/json" \
  -d '{
    "text": "She go to school yesterday",
    "studentLevel": "Beginner"
  }'
```

**Response:**
```json
{
  "result": "Grammar Check Results:\n1. Error Found: 'go' should be 'went'\n2. Explanation: ...\n3. Correct Version: 'She went to school yesterday.'\n..."
}
```

---

### 2. POST /vocabulary-lesson
Pelajari vocabulary baru dengan definisi, pronunciation, dan contoh.

**Request Body (JSON):**
```json
{
  "word": "Procrastinate",
  "context": "Study habits",
  "studentLevel": "Intermediate"
}
```

**Parameters:**
- `word` (string, required) - Kata yang ingin dipelajari
- `context` (string, optional) - Konteks penggunaan kata
- `studentLevel` (string, optional) - Level siswa (default: "Intermediate")

**Example cURL:**
```bash
curl -X POST http://localhost:3000/vocabulary-lesson \
  -H "Content-Type: application/json" \
  -d '{
    "word": "Procrastinate",
    "context": "Study habits",
    "studentLevel": "Intermediate"
  }'
```

**Response:**
```json
{
  "result": "Vocabulary Lesson: Procrastinate\n1. Definition: To delay or postpone tasks\n2. Pronunciation: /proʊˈkræstəneɪt/\n3. Examples: ...\n4. Synonyms: ...\n5. Tips for remembering: ..."
}
```

---

### 3. POST /pronunciation-guide
Dapatkan panduan pronunciation untuk kata-kata tertentu.

**Request Body (JSON):**
```json
{
  "words": ["beautiful", "february", "worcestershire"],
  "studentLevel": "Beginner"
}
```

**Parameters:**
- `words` (array or string, required) - Kata atau list kata untuk dipelajari pronunciation-nya
- `studentLevel` (string, optional) - Level siswa (default: "Beginner")

**Example cURL:**
```bash
curl -X POST http://localhost:3000/pronunciation-guide \
  -H "Content-Type: application/json" \
  -d '{
    "words": ["beautiful", "february"],
    "studentLevel": "Beginner"
  }'
```

**Response:**
```json
{
  "result": "Pronunciation Guide:\n1. Beautiful\n   - Phonetic: byoo-tuh-ful\n   - IPA: /ˈbjuːtəfl/\n   - Stress: BYOOtiful\n   - Tips: ...\n2. February\n   - Phonetic: FEB-roo-er-ee\n   - IPA: /ˈfebrueri/\n   - ..."
}
```

---

### 4. POST /conversation-practice
Latihan percakapan dengan guru bahasa inggris secara interaktif.

**Request Body (JSON):**
```json
{
  "topic": "Ordering at a restaurant",
  "studentLevel": "Intermediate",
  "userMessage": "I want eat pizza"
}
```

**Parameters:**
- `topic` (string, required) - Topik percakapan
- `studentLevel` (string, optional) - Level siswa (default: "Intermediate")
- `userMessage` (string, optional) - Pesan dari siswa (jika kosong, guru memulai percakapan)

**Example cURL:**
```bash
curl -X POST http://localhost:3000/conversation-practice \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Ordering at a restaurant",
    "studentLevel": "Intermediate",
    "userMessage": "I want eat pizza"
  }'
```

**Response:**
```json
{
  "result": "Teacher: Great! Let me help you improve that sentence.\n\n1. Your sentence: 'I want eat pizza'\n2. Correction: 'I want to eat pizza' or 'I'd like to eat pizza'\n3. Explanation: After 'want', we need the infinitive form 'to eat'\n4. Natural alternative: 'Could I have a pizza, please?'\n5. Follow-up: What size would you like?\n..."
}
```

---

### 5. POST /quiz
Buat kuis pembelajaran untuk menguji kemampuan bahasa Inggris.

**Request Body (JSON):**
```json
{
  "topic": "Present Perfect Tense",
  "questionCount": 5,
  "studentLevel": "Intermediate",
  "type": "multiple-choice"
}
```

**Parameters:**
- `topic` (string, required) - Topik kuis
- `questionCount` (number, optional) - Jumlah pertanyaan (default: 5)
- `studentLevel` (string, optional) - Level siswa (default: "Intermediate")
- `type` (string, optional) - Tipe soal: "multiple-choice", "true-false", "fill-the-blank", "short-answer" (default: "multiple-choice")

**Example cURL:**
```bash
curl -X POST http://localhost:3000/quiz \
  -H "Content-Type: application/json" \
  -d '{
    "topic": "Present Perfect Tense",
    "questionCount": 5,
    "studentLevel": "Intermediate",
    "type": "multiple-choice"
  }'
```

**Response:**
```json
{
  "result": "English Quiz: Present Perfect Tense\n\nQuestion 1: Have you ever _____ to Paris?\nA) go\nB) gone\nC) went\nD) going\n\n...\n\nAnswer Key:\n1. B) gone\n   Explanation: The present perfect uses the past participle...\n\nLearning Tips: ...\nSuggestions for Improvement: ..."
}
```

---

### Generate Text
```javascript
async function generateText() {
  const response = await fetch('http://localhost:3000/generate-text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: 'Jelaskan apa itu machine learning'
    })
  });
  
  const data = await response.json();
  console.log(data.result);
}

generateText();
```

### Generate from Image
```javascript
async function generateFromImage() {
  const formData = new FormData();
  formData.append('prompt', 'Apa yang ada di gambar ini?');
  formData.append('image', document.getElementById('imageInput').files[0]);
  
  const response = await fetch('http://localhost:3000/generate-from-image', {
    method: 'POST',
    body: formData
  });
  
  const data = await response.json();
  console.log(data.result);
}
```

### Generate from Document
```javascript
async function generateFromDocument() {
  const formData = new FormData();
  formData.append('prompt', 'Buat poin-poin penting dari dokumen');
  formData.append('document', document.getElementById('documentInput').files[0]);
  
  const response = await fetch('http://localhost:3000/generate-from-document', {
    method: 'POST',
    body: formData
  });
  
  const data = await response.json();
  console.log(data.result);
}
```

### Generate from Audio
```javascript
async function generateFromAudio() {
  const formData = new FormData();
  formData.append('prompt', 'Buat transkrip dari audio');
  formData.append('audio', document.getElementById('audioInput').files[0]);
  
  const response = await fetch('http://localhost:3000/generate-from-audio', {
    method: 'POST',
    body: formData
  });
  
  const data = await response.json();
  console.log(data.result);
}
```

### Check Grammar
```javascript
async function checkGrammar() {
  const response = await fetch('http://localhost:3000/check-grammar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: 'She go to school yesterday',
      studentLevel: 'Beginner'
    })
  });
  
  const data = await response.json();
  console.log(data.result);
}

checkGrammar();
```

### Vocabulary Lesson
```javascript
async function vocabularyLesson() {
  const response = await fetch('http://localhost:3000/vocabulary-lesson', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      word: 'Serendipity',
      studentLevel: 'Intermediate'
    })
  });
  
  const data = await response.json();
  console.log(data.result);
}

vocabularyLesson();
```

### Pronunciation Guide
```javascript
async function pronunciationGuide() {
  const response = await fetch('http://localhost:3000/pronunciation-guide', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      words: ['beautiful', 'worcestershire', 'february'],
      studentLevel: 'Intermediate'
    })
  });
  
  const data = await response.json();
  console.log(data.result);
}

pronunciationGuide();
```

### Conversation Practice
```javascript
async function conversationPractice() {
  const response = await fetch('http://localhost:3000/conversation-practice', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      topic: 'Ordering at a restaurant',
      studentLevel: 'Intermediate',
      userMessage: 'I want eat pizza please'
    })
  });
  
  const data = await response.json();
  console.log(data.result);
}

conversationPractice();
```

### Quiz
```javascript
async function takeQuiz() {
  const response = await fetch('http://localhost:3000/quiz', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      topic: 'Present Perfect Tense',
      questionCount: 5,
      studentLevel: 'Intermediate',
      type: 'multiple-choice'
    })
  });
  
  const data = await response.json();
  console.log(data.result);
}

takeQuiz();
```

## Struktur Project

```
gemini-flash-api/
├── index.js           # Main server file dengan semua endpoints
├── package.json       # Dependencies
├── .env               # Environment variables (jangan commit!)
├── .gitignore         # Git ignore file
├── README.md          # Dokumentasi ini
└── uploads/           # Folder untuk menyimpan file yang diupload (auto-generated)
```

**Catatan:** Folder `uploads/` akan terbentuk otomatis saat server berjalan dan file pertama diupload.

## Model AI

Service ini menggunakan model **Gemini 2.5 Flash** yang memiliki:
- Processing cepat untuk real-time responses
- Support multimodal (text, image, document, audio)
- Optimized untuk latency rendah dan throughput tinggi

## Error Handling

Jika terjadi error, service akan mengembalikan response dengan status code 500:

```json
{
  "message": "Error description here"
}
```

**Common errors:**
- API key tidak valid
- File terlalu besar
- Format file tidak didukung
- Network error

## Port Configuration

Default port adalah **3000**. Jika ingin mengubah port, edit `index.js`:
```javascript
const PORT = 3000; // Ubah ke port yang diinginkan
```

## Tips & Tricks

1. **Untuk dokumen besar**, gunakan endpoint `/generate-from-document` untuk mendapatkan ringkasan otomatis
2. **Untuk analisis gambar**, berikan prompt yang spesifik untuk hasil lebih akurat
3. **Untuk transkripsi audio**, pastikan audio berkualitas baik
4. **Test dengan Postman**, download [Postman](https://www.postman.com/downloads/) untuk testing yang lebih mudah
5. **File upload otomatis disimpan** di folder `uploads/` dengan nama unik (timestamp + random string) untuk mencegah duplikasi

## Troubleshooting

### "Cannot find module '@google/genai'"
```bash
npm install
```

### "GEMINI_API_KEY is not defined"
Pastikan `.env` file sudah dibuat dan berisi API key yang valid.

### "Server tidak berjalan di port 3000"
```bash
# Check apakah port 3000 sudah digunakan
# Windows
netstat -ano | findstr :3000

# macOS/Linux
lsof -i :3000
```

Jika port sudah digunakan, ubah PORT di `index.js` ke port lain seperti 3001, 3002, dll.

## Lisensi

ISC

## Support

Jika ada pertanyaan atau issue, silakan buat issue di repository.
