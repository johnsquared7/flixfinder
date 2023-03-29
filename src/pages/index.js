import React, { useState } from "react";

const Index = () => {
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState("");
  const [queryResult, setQueryResult] = useState([]);

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

  const handleExecuteSql = async () => {
    setIsLoading(true);

    const response = await fetch("/api/executeSql", {
      method: "POST",
      body: JSON.stringify({ sqlQuery: output }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    setQueryResult(data);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-8">FlixFinder</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex-col items-center">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="py-2 px-4 rounded-md focus:outline-none ring-2 ring-blue-300 focus:ring-blue-400 w-128 text-center"
            placeholder="Find me action movies from 2022"
          />
          <div className="flex flex-col items-center justify-center display:block">
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-4"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Submit"}
            </button>
          </div>
        </div>
      </form>

      {output && (
        <div className="flex flex-col items-center mt-8">
          <h2 className="text-2xl font-bold mb-4">SQL Generated:</h2>
          <p className="bg-gray-100 py-2 px-4 rounded-md shadow-md flex-wrap w-128">
            {output}
          </p>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-4"
            onClick={handleExecuteSql}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Execute SQL"}
          </button>
        </div>
      )}

      {queryResult.length > 0 && (
        <div className="flex flex-col items-center mt-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">Query Result:</h2>
          <div className="w-full max-w-8xl overflow-x-scroll">
            <table className="table-auto w-full">
              <thead>
                <tr>
                  {Object.keys(queryResult[0]).map((key) => (
                    <th
                      key={key}
                      className="px-4 py-2 text-left text-blue-500 font-semibold bg-gray-200"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {queryResult.map((row, index) => (
                  <tr
                    key={index}
                    className={`hover:bg-blue-100 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-100"
                    }`}
                  >
                    {Object.entries(row).map(([key, value], index, array) => (
                      <td key={index} className="border px-4 py-2">
                        {index === array.length - 1 ? (
                          <a
                            href={value}
                            className="text-blue-500 hover:text-blue-600"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {value}
                          </a>
                        ) : (
                          value
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
