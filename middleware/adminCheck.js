const { prisma } = require("../prisma/prisma-client");

const adminCheck = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Доступ запрещён." });
  }
};

module.exports = {
  adminCheck,
};
