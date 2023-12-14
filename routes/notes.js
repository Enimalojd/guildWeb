const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { isAdmin } = require("../middleware/adminCheck");
const {
  all,
  target,
  addNote,
  deleteNote,
  changeNote,
} = require("../controllers/notes");
// Ве заметки для модератора
router.get("/", auth, isAdmin, all);
// Личные заметки пользователя
router.get("/:id", auth, target);
//Добавление заметки
router.post("/add", auth, isAdmin, addNote);
//Удаление заметки
router.post("/remove/:id", auth, isAdmin, deleteNote);
//Изменение заметки
router.put("edit/:id", auth, isAdmin, changeNote);

module.exports = router;
