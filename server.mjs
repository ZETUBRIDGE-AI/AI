import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// ✅ OpenAI config
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ✅ GET / route
app.get("/", (req, res) => {
  res.send("MED-A AI backend is running. Use POST /chat to send messages.");
});

// ✅ POST /chat route
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: message }]
    });

    // ✅ Correctly extract the assistant's message
    const reply = response.choices?.[0]?.message?.content;

    if (!reply) return res.json({ reply: "No reply from AI" });

    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
