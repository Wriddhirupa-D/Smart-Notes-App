const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const FILE_PATH = "./notes.json";

// Helper function to read notes
const readNotes = () => {
  const data = fs.readFileSync(FILE_PATH, "utf-8");
  return JSON.parse(data);
};

// Helper function to write notes
const writeNotes = (notes) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(notes, null, 2));
};

// Get all notes
app.get("/notes", (req, res) => {
  const notes = readNotes();
  res.json(notes);
});

// Create a note
app.post("/notes", (req, res) => {
  const { title, content, tags } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  const notes = readNotes();

  const newNote = {
    id: Date.now(),
    title,
    content,
    tags: tags || []
  };

  notes.push(newNote);
  writeNotes(notes);

  res.status(201).json(newNote);
});

// Delete a note
app.delete("/notes/:id", (req, res) => {
  const noteId = Number(req.params.id);
  let notes = readNotes();

  notes = notes.filter((note) => note.id !== noteId);
  writeNotes(notes);

  res.json({ message: "Note deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});