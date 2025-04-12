import React, { useRef, useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "../UserContext";
import "./Idea.css";
import { updateIdeas, getIdeaByID } from "../data/IdeaData";

function Idea() {
  const canvasRef = useRef(null);
  const { id: ideaID } = useParams();
  const [imageID, setImageID] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ideaName, setIdeaName] = useState("");
  const [isErasing, setIsErasing] = useState(false);
  const [category, setCategory] = useState("");
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [color, setColor] = useState("#000000");
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const loadIdea = async () => {
      // Ensure both ideaID and valid user token are available.
      if (!user?.token) {
        console.error("Missing user token");
        return;
      }
  
      try {
        const response = await fetch(`http://localhost:3000/idea/${ideaID}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });
  
        if (!response.ok) {
          console.error("Failed to fetch idea");
          return;
        }
  
        const existingIdea = await response.json();
        console.log("Fetched idea:", existingIdea.image[0]);
  
        setImageID(existingIdea.image[0].imageID);
        // Use the fetched idea data to update state.
        setIdeaName(existingIdea.name);
        // Assumes that categories is an array; adjust if your data structure differs
        setCategory(existingIdea.categories?.[0]?.description || "");
  
        // Safely handle paths.
        const formattedPaths = Array.isArray(existingIdea.image[0].data.paths)
          ? existingIdea.image[0].data.paths.map((p) => ({
              color: p.isErasing ? null : p.color || "#000000",
              // p.path is already an array per your log
              path: p.path || [],
              isErasing: !!p.isErasing,
            }))
          : [];
  
        setPaths(formattedPaths);
  
        // Drawing paths on canvas:
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
  
        formattedPaths.forEach((pathObj) => {
          if (pathObj.isErasing) {
            ctx.globalCompositeOperation = "destination-out";
            ctx.lineWidth = 10;
          } else {
            ctx.globalCompositeOperation = "source-over";
            ctx.strokeStyle = pathObj.color;
            ctx.lineWidth = 2;
          }
  
          ctx.beginPath();
          pathObj.path.forEach((point, index) => {
            if (index === 0) {
              ctx.moveTo(point.x, point.y);
            } else {
              ctx.lineTo(point.x, point.y);
            }
          });
          ctx.stroke();
        });
      } catch (error) {
        console.error("Error fetching idea:", error);
      }
    };
  
    loadIdea();
  }, [ideaID, user]);  

  const startDrawing = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    setIsDrawing(true);
    setCurrentPath([{ x: offsetX, y: offsetY }]);

    const ctx = canvasRef.current.getContext("2d");

    if (isErasing) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = 10;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
    }

    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;

    const ctx = canvasRef.current.getContext("2d");

    if (isErasing) {
      ctx.globalCompositeOperation = "destination-out"; // Remove pixels while erasing
      ctx.lineWidth = 10;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
    }

    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();

    setCurrentPath((prev) => [...prev, { x: offsetX, y: offsetY }]);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
  
    setPaths((prev) => [
      ...prev,
      {
        color: isErasing ? null : color,
        path: currentPath,
        isErasing: isErasing,            // track eraser mode
      },
    ]);
  
    setCurrentPath([]);
  };
  
  const handleSave = async () => {
    const newIdea = {
      ideaID: ideaID || Date.now().toString(),
      imageID: imageID,
      name: ideaName,
      content: "Canvas drawing",
      creationDate: new Date().toISOString(),
      tags: [],
      categories: [category],
      paths: paths,
      sketchBase64: canvasRef.current.toDataURL("image/png"),
      sketchFormat: "png",

      // categories: [
      //   {
      //     description: [category],
      //   },
      // ],
      // image: [
      //   {
      //     ideaID: ideaID || Date.now().toString(),
      //     data: {
      //       base64: canvasRef.current.toDataURL("image/png"),
      //     },
      //   },
      // ],
      // paths: paths,
    };

    try {
      console.log("Saving new idea:", newIdea);
      if (ideaID) { // Update existing idea
        const response = await fetch(`http://localhost:3000/idea/${ideaID}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(newIdea),
        });
  
        if (response.ok) {
          console.log("Idea updated successfully");
          navigate("/home");
        } else {
          console.error("Failed to update idea");
        }
      } else { // Create new idea
        const response = await fetch("http://localhost:3000/idea/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(newIdea),
        });
    
        if (response.ok) {
          navigate("/home");
        } else {
          console.error("Failed to save idea");
        }
      }} 
    catch (err) {
      console.error("Error saving idea:", err);
    }

    console.log("Saving Idea: ", newIdea);
    // updateIdeas(newIdea);
    // navigate("/");
  };

  return (
    <div className="idea-page">
      <h2>{ideaID ? "✏️ Edit Your Idea" : "✨ New Idea"}</h2>
      <div className="input-container">
        <input
          type="text"
          placeholder="Idea Name"
          value={ideaName}
          onChange={(e) => setIdeaName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
      </div>
      <button
        className="erase-btn"
        onClick={() => setIsErasing((prev) => !prev)}
      >
        {isErasing ? "✏️ Switch to Draw" : "🧽 Switch to Erase"}
      </button>

      <canvas
        ref={canvasRef}
        width={500}
        height={300}
        className="drawing-canvas"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <button className="save-btn" onClick={handleSave}>
        Save
      </button>
    </div>
  );
}

export default Idea;
