import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Registration from "./components/Registration";
import Whiteboard from "./components/Whiteboard";
import WhiteboardList from "./components/WhiteboardList";
import useAuth from "@/redux/dispatch/useAuth";
import { Toaster } from "sonner";

const App = () => {
  const { auth } = useAuth();
  const [user, setUser] = useState(auth.user);
  const [page, setPage] = useState("login");
  const [activeWhiteboard, setActiveWhiteboard] = useState(null);

  // Use useEffect to update page state based on user authentication
  // {
  //   "boardTitle": "Project Alpha",
  //   "boardDescription": "This board is for tracking the progress of Project Alpha.",
  //   "boardElements": [
  //       { "type": "task", "content": "Design logo", "status": "in-progress" },
  //       { "type": "task", "content": "Set up project repository", "status": "completed" }
  //   ],
  //   "members": [
  //       { 
  //           "memberId": "603d2ba8f10a1821b8f2a4d9", 
  //           "lastAccessedAt": "2024-01-15T13:45:30Z"
  //       },
  //       { 
  //           "memberId": "603d2ba8f10a1821b8f2a4d8", 
  //           "lastAccessedAt": "2024-01-18T09:20:00Z"
  //       }
  //   ],
  //   "createdAt": "2023-12-19T21:40:00Z",
  //   "updatedAt": "2023-12-19T21:40:00Z"
  // }
  useEffect(() => {
    if (auth.user) {
      setUser(auth.user); // Automatically navigate to whiteboard page
    }
  }, [auth.user]);

  if (user) {
    return (
      <>
        {!activeWhiteboard ? (
          <WhiteboardList setActiveWhiteboard={setActiveWhiteboard} />
        ) : (
          <Whiteboard user={user} activeWhiteboard={activeWhiteboard} setActiveWhiteboard={setActiveWhiteboard} />
        )}
          <Toaster position="top-center" richColors />
      </>
    );
  }

  return (
    <>
      {page === "login" ? (
        <Login setUser={setUser} />
      ) : (
        <Registration setUser={setUser} />
      )}
      <button
        onClick={() => setPage(page === "login" ? "register" : "login")}
        className="absolute top-4 right-4 bg-blue-500 text-white py-1 px-4 rounded-md"
      >
        {page === "login" ? "Register" : "Login"}
      </button>
    </>
  );
};

export default App;
