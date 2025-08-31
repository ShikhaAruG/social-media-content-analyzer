"use client";
import { useState } from "react";
import DropZone from "../components/DropZone";
import Suggestions from "../components/Suggestions";
import { motion } from "framer-motion";


export default function HomePage() {
  const [extractedText, setExtractedText] = useState("");
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!extractedText.trim()) {
      setError("⚠ Please extract text first!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/analyze`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: extractedText,
            platform: "twitter",
          }),
        }
      );
      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      console.error("Analyze API Error:", err);
      setError(" Failed to analyze text. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-950 text-white">
      <h1 className="text-4xl font-extrabold mb-6 text-center text-amber-50 tracking-wide">
         Social Media Content Analyzer
      </h1>

      {/* Dropzone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <DropZone onExtractedText={setExtractedText} />
      </motion.div>

      {/* Extracted Text Box */}
      {extractedText && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-2xl mx-auto bg-white text-black mt-6 p-4 rounded-2xl shadow-1g border border-gray-500"
        >
          <h2 className="font-semibold mb-2 text-gray-700">Extracted Text:</h2>
          <textarea
            value={extractedText}
            onChange={(e) => setExtractedText(e.target.value)}
            className="w-full h-40 p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </motion.div>
      )}

      {/* Analyze Button */}
      {extractedText && (
        <div className="max-w-2xl mx-auto mt-6 text-center">
          <button
            onClick={handleAnalyze}
            disabled={loading}
            className="bg-gradient-to-r from-green-600 to-green-900 hover:from-green-500 hover:to-green-700 disabled:bg-gray-500 text-white px-8 py-3 rounded-xl shadow-md transition-transform transform hover:scale-105"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing...
              </span>
            ) : (
              "Analyze Text"
            )}
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-2xl mx-auto mt-4 text-red-400 text-center font-medium"
        >
          {error}
        </motion.div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto bg-white text-black mt-6 p-6 rounded-2xl shadow-lg"
        >
          <h2 className="font-semibold mb-4 text-xl text-center text-blue-600">
            📊 Analysis Results
          </h2>

          {/* Scores */}
          <div className="mb-4">
            <h3 className="font-bold text-gray-700">Scores:</h3>
            <ul className="list-disc ml-6 text-gray-800">
              <li>
                Sentiment:{" "}
                <span
                  className={
                    analysis.scores.sentiment > 0
                      ? "text-green-600 font-semibold"
                      : "text-red-600 font-semibold"
                  }
                >
                  {analysis.scores.sentiment}
                </span>
              </li>
              <li>Readability: {analysis.scores.readability}</li>
              <li>Length (chars): {analysis.scores.length_chars}</li>
              <li>Hashtags: {analysis.scores.hashtags}</li>
              <li>Mentions: {analysis.scores.mentions}</li>
              <li>Emoji: {analysis.scores.emoji}</li>
              <li>CTA Present: {analysis.scores.cta_present ? "✅" : "❌"}</li>
              <li>Links: {analysis.scores.links}</li>
            </ul>
          </div>

          {/* Insights */}
          <div className="mb-4">
            <h3 className="font-bold text-gray-700">Insights:</h3>
            <ul className="list-none space-y-2 mt-2">
              {analysis.insights.map((ins: any, i: number) => (
                <li
                  key={i}
                  className={`px-3 py-2 rounded-lg shadow-sm ${
                    ins.severity === "warn"
                      ? "bg-red-100 text-red-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {ins.message}
                </li>
              ))}
            </ul>
          </div>

          {/* Suggestions */}
          <Suggestions suggestions={analysis.suggestions || []} />

        </motion.div>
      )}
    </div>
  );
}
