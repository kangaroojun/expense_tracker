// export const fetchIdeas = async (token) => {
//   try {
//     const response = await fetch("http://localhost:3000/idea", {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });

//     if (!response.ok) {
//       throw new Error("Failed to fetch ideas");
//     }
//     const data = await response.json();
//     console.log("Fetched ideas:", data);
//     return data;
//   } catch (error) {
//     console.error("Error fetching ideas:", error);
//     return [];
//   }
// };

const ideaData = [
  {
    ideaID: "59454450-f0c1-4c1c-879a-6c61d034f173",
    userID: "b0096c79-8fcf-4a66-85d3-d35cfba0c3c2",
    name: "test",
    content: "This is a TEST",
    creationDate: "2025-04-09T02:45:52.660Z",
    modificationDate: "2025-04-09T02:45:52.660Z",
    tags: [],
    categories: [
      {
        categoryID: "df1a600b-555e-472c-8650-117c790d20ce",
        description: "Tech",
      },
    ],
    image: [
      {
        imageID: "a54ad333-1c34-47b7-be91-10bb1e347b0b",
        ideaID: "59454450-f0c1-4c1c-879a-6c61d034f173",
        data: {
          base64:
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAEsCAYAAA...",
        },
      },
    ],
    path: [],
  },
];

export default ideaData;

export const updateIdeas = (newIdea) => {
  const index = ideaData.findIndex((idea) => idea.ideaID === newIdea.ideaID);

  if (index !== -1) {
    ideaData[index] = newIdea;
  } else {
    ideaData.push(newIdea);
  }
};

export const getIdeaByID = (ideaID) => {
  return ideaData.find((idea) => idea.ideaID === ideaID);
};
