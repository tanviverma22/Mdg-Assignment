import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

interface CalculatorProps {
  token: string | null;
  user: { name: string; picture: string } | null;
  onLogout: () => void;
}

interface HistoryItem {
  expression: string;
  result: string;
}

const Calculator: React.FC<CalculatorProps> = ({ token, user, onLogout }) => {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (token) fetchHistory();
  }, [token]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/calculator/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const handleButtonClick = (value: string) => {
    if (value === "C") {
      setExpression("");
      setResult("");
    } else if (value === "=") {
      try {
        const evalResult = eval(expression);
        setResult(evalResult.toString());

        if (token) {
          axios.post("http://localhost:5000/api/calculator/history", { expression, result: evalResult.toString() }, {
            headers: { Authorization: `Bearer ${token}` },
          }).then(fetchHistory);
        }
      } catch {
        setResult("Error");
      }
    } else {
      setExpression(prev => prev + value);
    }
  };

  return (
    <motion.div className="w-full md:w-1/2 bg-gray-200 dark:bg-gray-800 p-6 rounded-lg shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold dark:text-white">Calculator</h1>
        {token && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
          >
            Logout
          </motion.button>
        )}
      </div>

      <div className="bg-gray-300 dark:bg-gray-700 p-4 rounded-lg text-right">
        <div className="text-2xl mb-1 dark:text-white">{expression || "0"}</div>
        <div className="text-xl text-gray-600 dark:text-gray-300">{result}</div>
      </div>

      <div className="grid grid-cols-4 gap-3 mt-4">
        {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+", "C"].map((btn, idx) => (
          <button key={idx} onClick={() => handleButtonClick(btn)} className="py-3 bg-gray-600 text-white rounded-lg">
            {btn}
          </button>
        ))}
      </div>

      {token ? (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 dark:text-white">History</h3>
          <div className="max-h-40 overflow-y-auto space-y-2">
            <AnimatePresence>
              {history.map((item, idx) => (
                <motion.div key={idx} className="p-2 bg-gray-700 text-white rounded-md">
                  {item.expression} = {item.result}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <div className="max-h-40 overflow-y-auto space-y-2">
            <p className="text-gray-600 dark:text-gray-300">Login to view history</p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default Calculator;