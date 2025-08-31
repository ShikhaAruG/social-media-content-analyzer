"use client";
import { motion } from "framer-motion";
import { Lightbulb, AlertTriangle } from "lucide-react";

export default function Suggestions({
  scores,
  insights = [],
  suggestions = [],
}: {
  scores?: any;
  insights?: any[];
  suggestions?: any[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-6"
    >
      <h3 className="text-xl font-bold text-center text-gray-700 mb-4">
        💡 Suggestions
      </h3>

      <div className="space-y-3">
        {suggestions.length > 0 ? (
          suggestions.map((sug: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-3 bg-gray-100 text-gray-800 p-4 rounded-xl shadow-md border border-gray-200"
            >
              {sug.type === "cta" ? (
                <Lightbulb className="text-yellow-500 w-6 h-6" />
              ) : (
                <AlertTriangle className="text-blue-500 w-6 h-6" />
              )}
              <span className="font-medium">{sug.text}</span>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-600 text-center">🎉 No suggestions needed!</p>
        )}
      </div>
    </motion.div>
  );
}
