const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const all = async (req, res) => {
  try {
    const notes = await prisma.note.findMany();
    res.status(200).json(notes);
  } catch (error) {
    res.status(400).json({ message: "Не удалось получить заметки." });
  }
};

const target = async (req, res) => {
  try {
    const notes = await prisma.note.findMany({
      where: {
        userId: req.user.id,
      },
    });
    res.status(200).json(notes);
  } catch (error) {
    res.status(400).json({ message: "Не удалось получить заметки." });
  }
};

const addNote = async (req, res) => {
  try {
    const data = req.body;

    if (!data.content || !data.nickname) {
      return res.status(400).json({ message: "Заполните тело заметки." });
    }

    const user = await prisma.user.findFirst({ where: { nickname } });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Пользователя с таким именем не существует." });
    }
    const note = await prisma.note.create({
      data: {
        content,
        authodId: req.user.id,
        userId: user,
      },
    });
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ message: "Не удалось добавить заметку." });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await prisma.note.delete({
      where: {
        id: parseInt(id),
      },
    });
    res.status(200).json(note);
  } catch (error) {
    res.status(400).json({ message: "Не удалось удалить заметку." });
  }
};

const changeNote = async (req, res) => {
  try {
    const { content } = req.body;
    const { id } = req.params;

    const updatedNote = await prisma.note.update({
      where: { id },
      data: { content },
    });
    res.status(400).json({ message: "Заметка успешно обновлена." });
  } catch (error) {
    res.status(400).json({ message: "Не изменить удалить заметку." });
  }
};

const markNote = async (req, res) => {
  try {
    const { id } = req.params;
    const note = await prisma.note.findUnique({ where: { id } });
    if (!note) {
      return res.status(400).json({ message: "Заметка не найдена" });
    }
    const updatedNote = await prisma.note.update({
      where: { id },
      data: { viewed: true },
    });
    res.json(updatedNote);
  } catch (error) {}
};

module.exports = {
  all,
  target,
  addNote,
  deleteNote,
  changeNote,
  markNote,
};
