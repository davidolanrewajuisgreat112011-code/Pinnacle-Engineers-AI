const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

dotenv.config({
    path: __dirname + "/.env"
});

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.post("/chat", async (req, res) => {
    try {
        const userMessage = req.body.message;

        const interaction = await ai.interactions.create({
            model: "gemini-3.5-flash-lite",
            input: userMessage
        });

        console.log("Gemini response:", JSON.stringify(interaction, null, 2));

res.json({
    reply: interaction.output_text || interaction.outputText || "Sorry, I couldn't generate a response."
});

    } catch (error) {
        console.error("Gemini error:", error);

        res.status(500).json({
            error: error.message || "Pinnacle AI is currently unavailable."
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Pinnacle AI server is running on port ${PORT}`);
});