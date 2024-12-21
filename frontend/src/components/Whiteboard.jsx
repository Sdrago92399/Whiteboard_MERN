import React, { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import useAuth from "@/redux/dispatch/useAuth";
import { toast } from "sonner";

const Whiteboard = ({ user, activeWhiteboard, setActiveWhiteboard }) => {
  const canvasRef = useRef(null);
  const cursorsRef = useRef({});
  const [tool, setTool] = useState("draw");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [fillColor, setFillColor] = useState("transparent");
  const { socket } = useAuth();
  let canvas;

  // Generate a random color for each user
  const getUserColor = (email) => {
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      hash = email.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  useEffect(() => {
    // Initialize canvas state from server
    socket.emit("joinWhiteboard", {whiteboardId: activeWhiteboard._id, userId: user.id});
    socket.emit("getCanvasState", activeWhiteboard);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) {
      canvas = new fabric.Canvas("canvas", {
        isDrawingMode: true,
      });
      canvasRef.current = canvas;
    } else {
      canvas = canvasRef.current;
    }

    socket.on("canvasState", (state) => {
      if (state) {
        try {
          canvas.clear();
          canvas.loadFromJSON(state, () => {
            console.log("Canvas state loaded successfully");
          //  canvas.renderAll();
          });
        } catch (err) {
          console.error("Error loading canvas state:", err);
        }
      }
    });

    // Create cursor elements for other users
    const createCursor = (userData) => {
      const cursor = document.createElement('div');
      cursor.style.position = 'fixed';
      cursor.style.backgroundColor = getUserColor(userData.email);
      cursor.style.padding = '4px 8px';
      cursor.style.borderRadius = '4px';
      cursor.style.color = 'white';
      cursor.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
      cursor.style.zIndex = '1000';
      cursor.style.pointerEvents = 'none';
      cursor.textContent = userData.username;
      document.body.appendChild(cursor);
      return cursor;
    };
    
    canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    canvas.freeDrawingBrush.width = 2;
    canvas.freeDrawingBrush.color = strokeColor;

    // Track mouse movement and emit position
    const handleMouseMove = (e) => {
      const rect = canvas.wrapperEl.getBoundingClientRect();
      const position = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        absolute: {
          x: e.clientX,
          y: e.clientY
        }
      };

      socket.emit("cursorMove", {
        position,
        userData: {
          email: user.email,
          username: user.username
        },
        whiteboard: activeWhiteboard._id
      }); 

      // socket.emit("updateCanvasState", {
      //   state: JSON.stringify(canvas.toJSON()),
      //   whiteboard: activeWhiteboard._id
      // });       

    };    

    // Listen for user joined and left messages
    socket.on("userJoined", (message) => {
      console.log('User Joined: ', message);
      toast.info(message);
    });

    socket.on('userLeft', (message) => {
      console.log('User Left: ', message);
      toast.warning(message);
    });

    // Listen for room closed message
    socket.on('roomClosed', (message) => {
      console.log('Room Closed: ', message);
      toast.error(message);
      setActiveWhiteboard(null); // Navigate back
    });

    // Handle cursor updates from other users
    socket.on("cursorMove", (data) => {
      if (data.userData.email === user.email) return;

      let cursor = cursorsRef.current[data.userData.email];
      if (!cursor) {
        cursor = createCursor(data.userData);
        cursorsRef.current[data.userData.email] = cursor;
      }

      cursor.style.left = `${data.position.absolute.x + 15}px`;
      cursor.style.top = `${data.position.absolute.y - 25}px`;
    });

    // Handle user disconnect
    socket.on("userDisconnected", (email) => {
      if (cursorsRef.current[email]) {
        document.body.removeChild(cursorsRef.current[email]);
        delete cursorsRef.current[email];
      }
    });

    canvas.wrapperEl.addEventListener('mousemove', handleMouseMove);

    // Modify the existing syncCanvas function to include whiteboard ID
    const handleMouseEvents = () => {
      let shape;
      let isDrawing = false;

      canvas.on("mouse:down", (event) => {
        const pointer = canvas.getPointer(event.e);

        if (tool === "draw") {
          canvas.isDrawingMode = true;
          canvas.selection = false;
        } else if (tool === "delete") {
          canvas.isDrawingMode = false;
          canvas.selection = true;  // Enable selection for deletion

          const pointer = canvas.getPointer(event.e);
          const objects = canvas.getObjects();
          
          // Loop through objects and remove the one that contains the pointer
          objects.forEach((obj) => {
            if (obj.containsPoint(pointer)) {
              canvas.remove(obj);
              syncCanvas(obj, true); // Sync object deletion
            }
          });

          // Remove all active (selected) objects
          const activeObjects = canvas.getActiveObjects();
          while (activeObjects.length > 0) {
            const obj = activeObjects[0];
            canvas.remove(obj);
            syncCanvas(obj, true); // Sync object deletion
            activeObjects.splice(0, 1); // Remove the first element from the activeObjects array
          }

          canvas.discardActiveObject(); // Deselect objects after deletion
          canvas.renderAll();
        } else if (tool === "select") {
          canvas.isDrawingMode = false;
          canvas.selection = true;
          canvas.forEachObject((obj) => (obj.selectable = true));
        } else if (tool === "text") {
          canvas.isDrawingMode = false;
          canvas.selection = false;
          canvas.forEachObject((obj) => (obj.selectable = false));

          const textbox = new fabric.Textbox("", {
            left: pointer.x,
            top: pointer.y,
            fontSize: 16,
            fill: strokeColor,
            editable: true,
            fontFamily: "Arial",
          });

          canvas.add(textbox);
          canvas.setActiveObject(textbox);
          textbox.enterEditing();
          textbox.hiddenTextarea.focus();
          canvas.renderAll();

          textbox.on("editing:entered", () => {
            isDrawing = false;
          });

          textbox.on("editing:exited", () => {
            if (!textbox.text.trim()) {
              canvas.remove(textbox);
            } else {
              syncCanvas(textbox); // Sync the added/updated text
            }       

            // Sync entire canvas state after significant changes
            socket.emit("updateCanvasState", {
              state: JSON.stringify(canvas.toJSON()),
              whiteboard: activeWhiteboard._id
            });
          });
        } else {
          canvas.isDrawingMode = false;
          canvas.selection = false;
          canvas.forEachObject((obj) => (obj.selectable = false));
          isDrawing = true;

          const options = {
            left: pointer.x,
            top: pointer.y,
            stroke: strokeColor,
            fill: tool === "line" ? "transparent" : fillColor,
            strokeWidth: 2,
            originX: "center",
            originY: "center",
          };

          if (tool === "rectangle") {
            shape = new fabric.Rect({ ...options, width: 0, height: 0 });
          } else if (tool === "circle") {
            shape = new fabric.Circle({ ...options, radius: 0 });
          } else if (tool === "line") {
            shape = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], options);
          }

          if (shape) canvas.add(shape);
        }
      });

      canvas.on("mouse:move", (event) => {
        if (!isDrawing || !shape) return;
        const pointer = canvas.getPointer(event.e);

        if (tool === "rectangle") {
          shape.set({
            width: Math.abs(pointer.x - shape.left),
            height: Math.abs(pointer.y - shape.top),
          });
        } else if (tool === "circle") {
          const radius = Math.sqrt(
            Math.pow(pointer.x - shape.left, 2) + Math.pow(pointer.y - shape.top, 2)
          );
          shape.set({ radius });
        } else if (tool === "line") {
          shape.set({ x2: pointer.x, y2: pointer.y });
        }

        canvas.renderAll();
      });

      canvas.on("mouse:up", () => {
        if (isDrawing && shape) {
          syncCanvas(shape);
          shape = null;
        }
        isDrawing = false;
        
        // Sync entire canvas state after significant changes
        socket.emit("updateCanvasState", {
          state: JSON.stringify(canvas.toJSON()),
          whiteboard: activeWhiteboard._id
        });
      });
    };

    handleMouseEvents();

    // Handle drawing updates from other users
    socket.on("draw", (data) => {
      if (data.user !== user.email) {
        fabric.util.enlivenObjects([data.object], (objects) => {
          objects.forEach((obj) => {
            if (data.delete) {
              const existingObject = canvas.getObjects().find((o) => o.id === obj.id);
              if (existingObject) canvas.remove(existingObject);
            } else {
              canvas.add(obj);
            }
          });
          canvas.renderAll();
        });
      }
    });

    return () => {
      canvas.off("mouse:down");
      canvas.off("mouse:move");
      canvas.off("mouse:up");
      socket.off("draw");
      socket.off('userJoined');
      socket.off('userLeft');
      socket.off("cursorMove");
      socket.off("userDisconnected");
      socket.off("canvasState");
      canvas.wrapperEl.removeEventListener('mousemove', handleMouseMove);
      
      // Clean up cursor elements
      Object.values(cursorsRef.current).forEach(cursor => {
        document.body.removeChild(cursor);
      });
      cursorsRef.current = {};
    };
  }, [tool, strokeColor, fillColor, user.email, activeWhiteboard, setActiveWhiteboard]);

  const syncCanvas = (object, deleteObject = false) => {
    socket.emit("draw", {
      object: deleteObject ? { id: object.id } : object.toObject(),
      user: user.email,
      delete: deleteObject,
      whiteboard: activeWhiteboard._id
    });
  };

  const handleBackClick = () => {
    socket.emit('disconnectUser', activeWhiteboard._id); 
    setActiveWhiteboard(null); 
  };  

  return (
    <div className="h-screen w-screen flex flex-col items-center bg-gray-100">
      <div className="w-full flex justify-between bg-white p-4 shadow-md">
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-md ${
              tool === "select" ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setTool("select")}
          >
            Select
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              tool === "delete" ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setTool("delete")}
          >
            Delete
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              tool === "draw" ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setTool("draw")}
          >
            Draw
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              tool === "text" ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setTool("text")}
          >
            Text
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              tool === "rectangle" ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setTool("rectangle")}
          >
            Rectangle
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              tool === "circle" ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setTool("circle")}
          >
            Circle
          </button>
          <button
            className={`px-4 py-2 rounded-md ${
              tool === "line" ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setTool("line")}
          >
            Line
          </button>
        </div>
        <div className="flex space-x-4">
          <input
            type="color"
            value={strokeColor}
            onChange={(e) => setStrokeColor(e.target.value)}
          />
          <input
            type="color"
            value={fillColor}
            onChange={(e) => setFillColor(e.target.value)}
          />
        </div>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded-md"
          onClick={handleBackClick}
        >
          Back
        </button>
      </div>
      <canvas id="canvas" width={800} height={600} className="mt-4 shadow-md"></canvas>
    </div>
  );
};

export default Whiteboard;