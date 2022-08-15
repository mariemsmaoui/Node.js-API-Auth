const router = require("express").Router();
const verify =require('./verifyToken')
router.get("/", verify,(req, res) => {
  res.send(req.user)
  /* .json({
    posts: {
      title: "my first post",
      description: "random data",
    },
  }); */
});

module.exports = router;
