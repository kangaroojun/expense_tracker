import React, { useRef, useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UserContext from "../UserContext";
import "./Idea.css";
import { updateIdeas, getIdeaByID } from "../data/IdeaData";

function Idea() {
  const canvasRef = useRef(null);
  const { id: ideaID } = useParams();
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
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); //fresh canvas

    if (ideaID) {
      const existingIdea = getIdeaByID(ideaID);
      if (existingIdea) {
        setIdeaName(existingIdea.name);
        setCategory(existingIdea.categories?.[0]?.description || "");

        const formattedPaths = existingIdea.paths?.map((path) => ({
          color: path.isErasing ? null : (path.color ?? "#000000"),
          path: path.path ?? [],
          isErasing: !!path.isErasing,
        })) || [];

        setPaths(formattedPaths);

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
        
      }
    }
  }, [ideaID]);

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
  

  const handleSave = () => {
    const newIdea = {
      ideaID: ideaID || Date.now().toString(),
      userID: user?.id || "default_user",
      name: ideaName,
      content: "Canvas drawing",
      creationDate: new Date().toISOString(),
      tags: [],
      categories: [
        {
          categoryID: "CATEGORY_ID",
          description: category,
        },
      ],
      image: [
        {
          imageID: "IMAGE_ID",
          ideaID: ideaID || Date.now().toString(),
          data: {
            base64: canvasRef.current.toDataURL("image/png"),
          },
        },
      ],
      paths: paths,
    };

    console.log("Saving Idea: ", newIdea);
    updateIdeas(newIdea);
    navigate("/");
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

// const handleSave = async () => {
//   const canvas = canvasRef.current;
//   const drawing = canvas.toDataURL();

//   const newIdea = {
//     name: ideaName,
//     categories: [category],
//     sketchBase64: drawing,
//     content: "This is a TEST",
//     sketchFormat: "png",
//   };

//   try {
//     const response = await fetch("http://localhost:3000/idea/create", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${user.token}`,
//       },
//       body: JSON.stringify(newIdea),
//     });

//     if (response.ok) {
//       navigate("/");
//     } else {
//       console.error("Failed to save idea");
//     }
//   } catch (err) {
//     console.error("Error saving idea:", err);
//   }
// };
