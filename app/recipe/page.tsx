"use client";

import { useState } from "react";

export default function RecipePage() {
  const [description, setDescription] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [time, setTime] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [recipe, setRecipe] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!description || !cuisine || !time || !difficulty) {
      alert("Please fill out all fields.");
      return;
    }

    setLoading(true);
    setRecipe("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, cuisine, time, difficulty }),
      });

      const data = await res.json();
      setRecipe(data.recipe || "No recipe returned.");
    } catch (err) {
      console.error(err);
      setRecipe("Failed to generate recipe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Recipe Generator</h1>

      <label className="block mb-2 font-semibold">Dish Description</label>
      <textarea
        className="w-full p-3 border rounded bg-white text-black"
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="e.g. spicy rice with chicken and vegetables"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <label className="block mb-1 font-semibold">Cuisine</label>
          <select
            className="w-full p-2 border border-gray-400 rounded bg-white text-black"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
          >
            <option value="">Select</option>
            <option value="Pakistani">Pakistani</option>
            <option value="Italian">Italian</option>
            <option value="Chinese">Chinese</option>
            <option value="Mexican">Mexican</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Time to Cook</label>
          <select
            className="w-full p-2 border border-gray-400 rounded bg-white text-black"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          >
            <option value="">Select</option>
            <option value="Under 30 mins">Under 30 mins</option>
            <option value="30–60 mins">30–60 mins</option>
            <option value="1–2 hours">1–2 hours</option>
            <option value="2+ hours">2+ hours</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Difficulty</label>
          <select
            className="w-full p-2 border border-gray-400 rounded bg-white text-black"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="">Select</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleGenerate}
        className="mt-6 px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Recipe"}
      </button>

      {recipe && (
        <div className="mt-8 p-5 bg-white text-black rounded shadow-md whitespace-pre-wrap">
          <h2 className="text-2xl font-bold mb-2">Generated Recipe</h2>
          <p>{recipe}</p>
        </div>
      )}
    </div>
  );
}
