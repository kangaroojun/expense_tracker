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
    return data;
  } catch (error) {
    console.error("Error fetching ideas:", error);
    return [];
  }
};
