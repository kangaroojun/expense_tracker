import React, { useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import "./IdeaCard.css";
import { useNavigate } from "react-router-dom";

const IdeaCard = ({ idea, onDelete, onRename }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(idea.name);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/idea/${idea.ideaID}`);
  };

  const handleRename = () => {
    onRename(idea.id, newTitle);
    setIsEditing(false);
  };

  const getCategoryClass = (category) => {
    switch (category) {
      case "tech":
        return "category-tech";
      case "sports":
        return "category-sports";
      case "health":
        return "category-health";
      case "finance":
        return "category-finance";
      default:
        return "category-default";
    }
  };

  return (
    <div className="idea-card" onClick={handleClick}>
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
                className={`${getCategoryClass(cat.description.toLowerCase())}`}
              >
                {cat.description}
              </span>
            ))}
          </div>
        </>
      )}

      <div className="icons">
        <FaEdit
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(!isEditing);
          }}
        />
        <FaTrash
          onClick={(e) => {
            e.stopPropagation();
            onDelete(idea.ideaID);
          }}
        />
      </div>
    </div>
  );
};

export default IdeaCard;
