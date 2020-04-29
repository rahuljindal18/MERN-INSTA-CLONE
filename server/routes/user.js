const express = require("express");
const router = express.Router();
const authorizeRoute = require("../middleware/authorizeRoute");
const SinglePost = require("../models/singlePost");
const User = require("../models/user");

router.get("/user/:id", authorizeRoute, async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).select("-password");
    SinglePost.find({ postedBy: req.params.id })
      .populate("postedBy", "_id name")
      .exec((err, posts) => {
        if (err) {
          return res.status(422).json({ error: err });
        }
        res.json({ user, posts });
      });
  } catch (err) {
    return res.status(404).json({ error: "User not found" });
  }
});

router.put("/follow", authorizeRoute, (req, res, next) => {
  try {
    User.findByIdAndUpdate(
      req.body.followerId,
      {
        $push: { followers: req.user._id },
      },
      {
        new: true,
      },
      async (err, result) => {
        if (err) {
          return res.status(422).json({ error: err });
        }
        const data = await User.findByIdAndUpdate(
          req.user._id,
          {
            $push: { following: req.body.followerId },
          },
          {
            new: true,
          }
        ).select("-password");
        res.status(201).json(data);
      }
    );
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

router.put("/unfollow", authorizeRoute, (req, res, next) => {
  try {
    User.findByIdAndUpdate(
      req.body.unfollowerId,
      {
        $pull: { followers: req.user._id },
      },
      {
        new: true,
      },
      async (err, result) => {
        if (err) {
          return res.status(422).json({ error: err });
        }
        const data = await User.findByIdAndUpdate(
          req.user._id,
          {
            $pull: { following: req.body.unfollowerId },
          },
          {
            new: true,
          }
        ).select("-password");
        res.status(201).json(data);
      }
    );
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

router.put("/updatepic", authorizeRoute, (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        pic: req.body.pic,
      },
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: err });
      }
      res.status(200).json(result);
    }
  );
});

router.post("/search-user", authorizeRoute, (req, res, next) => {
  let userPattern = new RegExp(`^${req.body.query}`);
  User.find({ email: { $regex: userPattern } })
    .select("_id email")
    .then((user) => {
      res.status(200).json({ user });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
