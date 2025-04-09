export const fetchIdeas = async (token) => {
  try {
    const response = await fetch("http://localhost:3000/idea", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch ideas");
    }
    const data = await response.json();
    console.log("Fetched ideas:", data);
    return data;
  } catch (error) {
    console.error("Error fetching ideas:", error);
    return [];
  }
};

// const ideaData = [
//   { id: 1, name: "Banana-powered car", category: "Tech" },
//   { id: 2, name: "Smart socks", category: "Health" },
//   { id: 3, name: "Teleporting coffee", category: "Tech" },
// ];

// export default ideaData;
