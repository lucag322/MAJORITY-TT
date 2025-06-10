"use client";

import React from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Globe } from "lucide-react";

export default function LoadingSpinner() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700 w-96 text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="flex justify-center mb-6"
        >
          <Globe className="w-16 h-16 text-blue-600" />
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          🌍 Loading Countries
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Exploring the world for you...
        </p>

        <div className="space-y-3">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {progress}% complete
          </p>
        </div>

        <div className="mt-6 flex justify-center space-x-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 bg-blue-600 rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
