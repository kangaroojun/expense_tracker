import React, { useState, useContext } from "react";
import IdeaCard from "../components/IdeaCard";
import ideaData from "../data/IdeaData";
import "./Home.css";
import UserContext from "../UserContext";

function Home() {
  const [ideas, setIdeas] = useState(ideaData);

  const handleDelete = (id) => {
    setIdeas(ideas.filter((idea) => idea.id !== id));
  };

  const handleRename = (id, newTitle) => {
    setIdeas(
      ideas.map((idea) =>
        idea.id === id ? { ...idea, title: newTitle } : idea
      )
    );
  };

  const { user } = useContext(UserContext);

  return (
    <div className="home-container">
      <h1>Hello {user?.name || "Guest"} 👋</h1>
      <h1>💡 Shitty Ideas Dump</h1>
      <div className="idea-grid">
        {ideas.map((idea) => (
          <IdeaCard
            key={idea.id}
            idea={idea}
            onDelete={handleDelete}
            onRename={handleRename}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
