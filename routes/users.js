const router = require("express").Router();
const user = require("../models/user");

const { getUsers, getUsersById, createUser } = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUsersById);
router.post("/", createUser);

// router.post("/", (req, res) => {

//   const { name, about, avatar } = req.body;
//   user.create({ name, about, avatar }).then((user) => res.send({ data: user }));
// });

module.exports = router;
