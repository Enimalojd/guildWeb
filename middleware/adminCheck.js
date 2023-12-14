const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Доступ запрещён." });
  }
};

module.exports = {
  isAdmin,
};
