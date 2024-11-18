const express = require("express");
const prisma = require("./prisma");
const app = express();
const PORT = 3001;

app.use(express.json()); // Body parsing middleware

// GET /users - Send array of all users
app.get("/users", async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (e) {
    next(e);
  }
});

// GET /users/:id - Send the user specified by id, including all playlists owned by the user
app.get("/users/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: { playlists: true },
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).send(`User with id ${id} not found`);
    }
  } catch (e) {
    next(e);
  }
});

// POST /users/:id/playlists - Create a new playlist owned by the user specified by id
app.post("/users/:id/playlists", async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const newPlaylist = await prisma.playlist.create({
      data: { name, userId: parseInt(id) },
    });
    res.status(201).json(newPlaylist);
  } catch (e) {
    next(e);
  }
});

// Middleware to handle errors
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("An error occurred");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
