const express = require("express");
const router = express.Router();
const authorizeRoute = require("../middleware/authorizeRoute");
const SinglePost = require("../models/singlePost");

const addSinglePost = async (req, res) => {
  try {
    const { title, body, pic } = req.body;
    req.user.password = undefined;
    const singlePost = new SinglePost({
      title,
      body,
      photo: pic,
      postedBy: req.user,
    });
    const result = await singlePost.save();
    if (result) {
      res.status(201).json({ post: result });
    }
  } catch (err) {
    console.log(err);
  }
};

router.get("/posts", authorizeRoute, async (req, res, next) => {
  try {
    const posts = await SinglePost.find()
      .populate("postedBy", "_id name")
      .populate("comments.postedBy", "_id name")
      .sort("-createdAt");
    res.status(200).json({ posts });
  } catch (err) {
    return res.status(500).json({ error: "error fetching posts" });
  }
});

//get all the posts of following users which are followed by the loggedin user
router.get("/followingPosts", authorizeRoute, async (req, res, next) => {
  try {
    const posts = await SinglePost.find({
      postedBy: { $in: req.user.following },
    })
      .populate("postedBy", "_id name")
      .populate("comments.postedBy", "_id name")
      .sort("-createdAt");
    res.status(200).json({ posts });
  } catch (err) {
    return res.status(500).json({ error: "error fetching posts" });
  }
});

router.post("/createpost", authorizeRoute, (req, res, next) => {
  const { title, body, pic } = req.body;
  if (!title || !body || !pic) {
    return res.status(400).json({ error: "Bad Request.Pass all the fields." });
  }

  addSinglePost(req, res);
});

router.get("/myposts", authorizeRoute, async (req, res, next) => {
  try {
    const posts = await SinglePost.find({ postedBy: req.user._id }).populate(
      "postedBy",
      "_id name"
    );
    res.status(200).json({ posts });
  } catch (err) {
    return res.status(500).json({ error: "error fetching posts" });
  }
});

router.put("/like", authorizeRoute, (req, res, next) => {
  SinglePost.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({ error: err });
    } else {
      return res.status(201).json(result);
    }
  });
});

router.put("/unlike", authorizeRoute, (req, res, next) => {
  SinglePost.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({ error: err });
    } else {
      return res.status(201).json(result);
    }
  });
});

router.put("/comment", authorizeRoute, (req, res, next) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  SinglePost.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id, name")
    .exec((err, result) => {
      if (err) {
        return res.status(400).json({ error: err });
      } else {
        return res.status(201).json(result);
      }
    });
});

router.delete("/delete/:postId", authorizeRoute, (req, res, next) => {
  SinglePost.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(400).json({ error: err });
      } else if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => res.status(201).json(result))
          .catch((err) => {
            console.log(err);
          });
      }
    });
});

module.exports = router;
