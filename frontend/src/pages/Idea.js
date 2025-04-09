import React, { useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../UserContext";
import "./Idea.css";

function Idea() {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ideaName, setIdeaName] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("#000000");
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleSave = async () => {
    const canvas = canvasRef.current;
    const drawing = canvas.toDataURL();

    const newIdea = {
      name: ideaName,
      categories: [category],
      sketchBase64: drawing,
      content: "This is a TEST",
      sketchFormat: "png",
    };

    try {
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
    } catch (err) {
      console.error("Error saving idea:", err);
    }
  };

  return (
    <div className="idea-page">
      <h2>🎨 Doodle Your Idea</h2>
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
