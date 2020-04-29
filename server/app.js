const express = require("express");
const mongoose = require("mongoose");
const { MONGOURI } = require("./keys");
const authRouter = require("./routes/auth");
const singlePostRouter = require("./routes/singlePost");
const userRouter = require("./routes/user");

const app = express();

const PORT = process.env.PORT || 5000;

mongoose.connect(MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Mongo DB connected");
});

mongoose.connection.on("error", (err) => {
  console.log("Error in connecting Mongo DB", err);
});

app.use(express.json());
app.use(authRouter);
app.use(singlePostRouter);
app.use(userRouter);

app.listen(PORT, console.log(`Server is running on port ${PORT}`));
