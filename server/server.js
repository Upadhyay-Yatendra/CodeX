import express from "express";
import dotenv from 'dotenv'
import cors from 'cors'
import OpenAI from 'openai';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
    res.status(200).send('Hello from Codex...');
});

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is missing in the request body" });
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    "role": "user",
                    "content": `${prompt}`
                }
            ],
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        console.log("\nRESPONSE :-> ",response);
        res.status(200).json({
            bot: response.choices[0].message.content
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
