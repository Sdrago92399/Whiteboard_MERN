import React, { useState, useEffect } from "react";
import { createWhiteboardApi, fetchWhiteboardsApi } from "@/api/index";
import notFoundImage from '../assets/not-found.png';

const WhiteboardList = ({ setActiveWhiteboard, user }) => {
  const [whiteboards, setWhiteboards] = useState([]);
  const [newBoardName, setNewBoardName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWhiteboards = async () => {
      try {
        const response = await fetchWhiteboardsApi();
        setWhiteboards(response.data);
      } catch (error) {
        console.error("Error fetching whiteboards:", error);
      }
    };

    fetchWhiteboards();
  }, []);

  const createWhiteboard = async () => {
    if (!newBoardName.trim()) {
      setError("Whiteboard name cannot be empty.");
      return;
    }

    try {
      const response = await createWhiteboardApi({ name: newBoardName });
      setWhiteboards([...whiteboards, response.data]);
      setNewBoardName("");
      setError("");
    } catch (error) {
      setError("Error creating whiteboard.");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-300 h-screen w-screen">
      <h1 className="text-3xl font-bold text-gray-800 drop-shadow-lg mb-6">
        Your Whiteboards
      </h1>
      <div className="mb-8 flex items-center space-x-4">
        <input
          type="text"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          placeholder="Enter a whiteboard name"
          className="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          onClick={createWhiteboard}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition-all duration-300"
        >
          Create
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      {whiteboards.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-16">
          <img
            src={notFoundImage} // Use a relevant image asset
            alt="No whiteboards"
            className="w-40 h-40 mb-6"
          />
          <p className="text-gray-600 text-lg text-center">
            No whiteboards found. Start by creating your first whiteboard!
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whiteboards.map((board) => (
            <li
              key={board._id}
              onClick={() => setActiveWhiteboard(board)}
              className="p-6 bg-white shadow-md rounded-lg cursor-pointer hover:bg-indigo-100 transition-all duration-300"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {board.boardTitle}
              </h2>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WhiteboardList;
