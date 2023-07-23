const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT ?? 5174;
const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.M0NGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.debug("Connected to database"))
  .catch(console.error);

app.get("/", (req, res) => {
  res.send("You are at the home page of the API now");
});

const Todo = require("./models/Todo");

app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post("/todo/new", (req, res) => {
  const todo = new Todo({
    text: req.body.text,
  });
  todo.save();
  res.json(todo);
});

app.delete("/todo/delete/:id", async (req, res) => {
  const todo = await Todo.findByIdAndDelete(req.params.id);
  res.json(todo);
});

app.put("/todo/complete/:id", async (req, res) => {
  const todo = await Todo.findById(req.params.id);
  todo.complete = !todo.complete;
  todo.save();

  res.json(todo);
});

app.listen(PORT, () =>
  console.log(`Server is running at http://localhost:${PORT}`)
);
