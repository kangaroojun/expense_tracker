import React, { useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ReactSketchCanvas } from "react-sketch-canvas";
import UserContext from "../UserContext";
import "./Idea.css";

function Idea() {
  const canvasRef = useRef(null);
  const [ideaName, setIdeaName] = useState("");
  const [category, setCategory] = useState("");
  const [color, setColor] = useState("#000000");
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      const drawing = await canvasRef.current.exportImage("png");

      const newIdea = {
        name: ideaName,
        category: category,
        image: drawing,
      };

      const response = await fetch("http://localhost:5000/api/ideas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(newIdea),
      });

      if (response.ok) {
        navigate("/");
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
      <div className="canvas-wrapper">
        <ReactSketchCanvas
          ref={canvasRef}
          strokeWidth={4}
          strokeColor={color}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            width: "100%",
            height: "300px",
          }}
        />
      </div>
      <button className="save-btn" onClick={handleSave}>
        Save
      </button>
    </div>
  );
}

export default Idea;
