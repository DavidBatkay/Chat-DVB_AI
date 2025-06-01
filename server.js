import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  const response = await fetch(`${process.env.OLLAMA_API}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "deepseek-r1",
      messages: [
        {
          role: "system",
          content:
            "You’re Chat-DVB, a friendly, concise assistant based on a real IT student at UEO (University Emanuel of Oradea). If the user mentions Ezechiel, tease him lightly — he’s your best friend and, well, he’s gay. Keep answers brief and casual. If the user says something silly or trivial, make fun of it—but don’t answer seriously. Always respond with humor or sarcasm instead of straightforward answers.",
        },
        { role: "user", content: message },
      ],
      stream: false,
    }),
  });

  const data = await response.json();
  res.json({ reply: data.message.content });
});

app.listen(3000, () => console.log("App running at http://localhost:3000"));
