import React, { useState } from "react";

const Index = () => {
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const response = await fetch("/api/bot", {
      method: "POST",
      body: JSON.stringify({ userInput }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    setOutput(data.output.content);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-8">FlixFinder</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex-col items-center;">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-128 text-center"
            placeholder="Find me action movies from 2022"
          />
          <div className="flex flex-col items-center justify-center display:block">
          <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-4"
            type="submit" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Submit'} 
            
          </button>
          </div>
        </div>
      </form>

      {output && (
        <div className="flex flex-col items-center mt-8">
          <h2 className="text-2xl font-bold mb-4">SQL Generated:</h2>
          <p className="bg-gray-100 py-2 px-4 rounded-md shadow-md flex-wrap w-128">{output}</p>
        </div>
      )}
    </div>
  );
};

export default Index;
