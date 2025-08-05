"use client";
import { useState } from "react";



export default function ActionModal({ initialCount = 1,  campaign_id = null, recomendations=null}) {
  const [isOpen, setIsOpen] = useState(false);
  const [count, setCount] = useState(initialCount);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);

  const handleIncrease = () => {
    console.log("Increase clicked");

    const percentage = count / 100;
    const result = 1 + percentage;

    console.log("Increment:", result);
    // alert(`Increment value: ${result.toFixed(2)}`);
    updateBudget(result);
  };

  const handleDecrease = () => {
    console.log("Decrease clicked");

    const percentage = count / 100;
    const result = 1 - percentage;

    console.log("Decrement:", result);
    // alert(`Decrement value: ${result.toFixed(2)}`);
    updateBudget(result);
  };

  const updateBudget = async (multiplier) => {
    if (!campaign_id) return;

    try {
      const response = await fetch(`https://app.wijte.me/api/campaign/budget/${campaign_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          "multiplier" : multiplier 
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update budget: ${response.status}`);
      }

      const data = await response.json();
      console.log("Budget update response:", data);
      alert("Budget updated successfully!");
    } catch (error) {
      console.error("Error updating budget:", error);
      alert("Failed to update budget.");
    }
  };

  return (
    <>
      <button
        className="w-full px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
        onClick={() => setIsOpen(true)}
      >
        Update
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative p-6">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            {/* Modal Content */}
            <h3 className="text-lg font-bold mb-4">Update Budget</h3>
            <p className="mb-4">Use the counter below:</p>

            {/* Centered Counter */}
            <div className="flex justify-center">
              <div className="flex items-center gap-4">
                <button
                  onClick={decrement}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xl font-bold"
                >
                  -
                </button>

                <input
                  type="text"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="text-lg font-medium w-16 text-center border border-gray-300 rounded px-1"
                />

                <button
                  onClick={increment}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xl font-bold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Conditional Buttons */}
            <div className="flex justify-center gap-4 py-4">
              {(count < initialCount || initialCount < 0 || (recomendations === "OPTIMIZE" && initialCount === 0)) && (
                <button 
                  onClick={handleDecrease}
                  className="px-8 py-2 bg-destructive text-white rounded hover:bg-destructive/80 transition text-sm"
                >
                  Decrease
                </button>
              )}

              {(count >= initialCount && initialCount >= 0) && (
                <button 
                  onClick={handleIncrease}
                  className="px-8 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm"
                >
                  Increase
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
