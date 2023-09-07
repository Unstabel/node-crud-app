import express from "express";
import fs from "fs/promises";
import cors from "cors";

const app = express();
const port = 3333;

app.use(express.json()); // to parse JSON bodies
app.use(cors());

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});

app.get("/", (request, response) => {
  response.send("Hello bitch");
});

app.get("/test", (request, response) => {
  response.send("This is a test route");
});

app.get("/users", async (request, response) => {
  const data = await fs.readFile("data.json");
  const users = JSON.parse(data);
  response.json(users);
});

app.post("/users", async (request, response) => {
  const newUser = request.body;
  newUser.id = new Date().getTime();
  const data = await fs.readFile("data.json");
  const users = JSON.parse(data);
  users.push(newUser);
  console.log(newUser);
  fs.writeFile("data.json", JSON.stringify(users));
  response.json(users);
});

app.put("/users/:id", async (request, response) => {
  const id = request.params.id;
  console.log(id);

  const data = await fs.readFile("data.json");
  const users = JSON.parse(data);
  let userToUpdate = users.find((user) => user.id == id);

  const body = request.body;

  userToUpdate.image = body.image;
  userToUpdate.mail = body.mail;
  userToUpdate.name = body.name;
  userToUpdate.title = body.title;

  fs.writeFile("data.json", JSON.stringify(users));
  response.json(users);
});

app.delete("/users/:id", async (request, response) => {
  const id = Number(request.params.id);

  const data = await fs.readFile("data.json");
  const users = JSON.parse(data);

  const newUsers = users.filter((user) => user.id !== id);
  fs.writeFile("data.json", JSON.stringify(newUsers));

  response.json(users);
});
