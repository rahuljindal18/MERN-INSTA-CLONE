const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const singlePostSchema = new mongoose.Schema(
  {
    title: {
      type: "String",
      required: true,
    },
    body: {
      type: "String",
      required: true,
    },
    photo: {
      type: "String",
      required: true,
    },
    likes: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        text: String,
        postedBy: {
          type: ObjectId,
          ref: "User",
        },
      },
    ],
    postedBy: {
      type: ObjectId, //this refers to the id of the user who has created the post
      ref: "User", //this refers to the "User" model
    },
  },
  { timestamps: true }
);

const SinglePost = mongoose.model("Post", singlePostSchema);
module.exports = SinglePost;
