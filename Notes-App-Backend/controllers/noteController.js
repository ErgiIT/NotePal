const Note = require("./../models/noteModel");
const asyncHandler = require("express-async-handler");

const getAllUserNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ user: req.params.userId });
  res.json(notes);
});

const createNote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    res.status(400).send({ message: "Please fill all the Fields" });
    throw new Error("Please fill all the Fields");
  } else {
    const note = new Note({
      user: req.params.userId,
      title,
      content,
    });

    const createdNote = await note.save();

    res.status(201).json(createdNote);
  }
});

const getNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.noteId);

  if (note) {
    res.json(note);
  } else {
    res.status(404).json({ message: "Note not found" });
  }
});

const updateNote = asyncHandler(async (req, res) => {
  // user will provide this
  const { title, content } = req.body;

  const note = await Note.findById(req.params.noteId);

  if (note) {
    // updating note
    note.title = title;
    note.content = content;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } else {
    res.status(404).send({ message: "Note not found" });
    throw new Error("Note not found");
  }
});

const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.noteId);

  if (note) {
    await note.remove();
    res.json({ message: "Note Removed" });
  } else {
    res.status(404).send({ message: "Note not found" });
    throw new Error("Note not found");
  }
});

module.exports = {
  getAllUserNotes,
  createNote,
  getNote,
  updateNote,
  deleteNote,
};
