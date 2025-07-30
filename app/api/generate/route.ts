import { Groq } from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

export async function POST(req: Request) {
  const { description, cuisine, time, difficulty } = await req.json();

  const prompt = `Generate a recipe based on:
- Description: ${description}
- Cuisine: ${cuisine}
- Time: ${time}
- Difficulty: ${difficulty}
Make it detailed and include ingredients and instructions.`;

  try {
    const chat = await groq.chat.completions.create({
      model: "llama3-70b-8192", // Use a valid free model
      messages: [{ role: "user", content: prompt }],
    });

    const response = chat.choices[0]?.message?.content;
    return NextResponse.json({ recipe: response });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Failed to generate recipe" }, { status: 500 });
  }
}
