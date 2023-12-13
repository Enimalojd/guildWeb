const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email && !password) {
    return res
      .status(400)
      .json({ message: "Пожалуйста, заполните обязательные поля." });
  }

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  const isPasswordCorrect =
    user && (await bcrypt.compare(password, user.password));

  if (user || isPasswordCorrect) {
    res.status(200).json({
      id: user.id,
      email: user.email,
      nickname: user.nickname,
    });
  } else {
    return res
      .status(400)
      .json({ message: "Неверно введён логин или пароль." });
  }
};

const register = async (req, res) => {
  const { email, nickname, password } = req.body;

  if (!email || !password || !nickname) {
    return res
      .status(400)
      .json({ message: "Пожалуйста, заполните обязательные поля." });
  }

  const registeredUser = await prisma.user.findFirst({
    where: {
      email,
      nickname,
    },
  });
  if (registeredUser) {
    return res.status(400).json({
      message: "Пользователь с таким email или nickname уже существует.",
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await prisma.user.create({
    data: {
      email,
      nickname,
      password: hashedPassword,
    },
  });

  const secret = process.env.JWT_SECRET;

  if (newUser && secret) {
    res.status(201).json({
      id: newUser.id,
      email: newUser.email,
      token: jwt.sign({ id: newUser.id }, secret, { expiresIn: "4d" }),
    });
  } else {
    return res.status(400).json({ message: "Неудалось создать пользователя." });
  }
};

const current = async (req, res) => {
  return res.status(200).json(req.user);
};

module.exports = {
  login,
  register,
  current,
};
