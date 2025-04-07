import React, { useEffect, useState, useContext } from "react";
import UserContext from "../UserContext";
import IdeaCard from "../components/IdeaCard";
import "./Home.css";
import { fetchIdeas } from "../data/IdeaData";

function Home() {
  const { user } = useContext(UserContext);
  const [ideas, setIdeas] = useState([]);

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

  useEffect(() => {
    const loadIdeas = async () => {
      if (user?.token) {
        const data = await fetchIdeas(user.token);
        setIdeas(data);
      }
    };

    loadIdeas();
  }, [user]);

  return (
    <div className="home-container">
      {/* <h1>Hello {user?.name || "Guest"} 👋</h1> */}
      <h2>💡 Shitty Ideas Dump</h2>
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
