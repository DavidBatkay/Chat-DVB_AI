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
          content: process.env.OLLAMA_TRAINER,
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
