import React, { useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import "./IdeaCard.css";

const IdeaCard = ({ idea, onDelete, onRename }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(idea.name);

  const handleRename = () => {
    onRename(idea.id, newTitle);
    setIsEditing(false);
  };

  const getCategoryClass = (category) => {
    switch (category) {
      case "Tech":
        return "category-tech";
      case "Sports":
        return "category-sports";
      case "Health":
        return "category-health";
      case "Finance":
        return "category-finance";
      default:
        return "category-default";
    }
  };

  return (
    <div className="idea-card">
      {idea.image && idea.image.length > 0 && (
        <img
          src={idea.image[0].data.base64}
          alt={idea.name}
          className="idea-image"
        />
      )}

      {isEditing ? (
        <>
          <input
            className="rename-input"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <button className="save-btn" onClick={handleRename}>
            Save
          </button>
        </>
      ) : (
        <>
          <h3>{idea.name}</h3>

          <div className="categories">
            {idea.categories.map((cat, index) => (
              <span
                key={index}
                className={`${getCategoryClass(cat.description)}`}
              >
                {cat.description}
              </span>
            ))}
          </div>
        </>
      )}

      <div className="icons">
        <FaEdit onClick={() => setIsEditing(!isEditing)} />
        <FaTrash onClick={() => onDelete(idea.id)} />
      </div>
    </div>
  );
};

export default IdeaCard;
