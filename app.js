const express = require("express"); // this file requires express server
const port = process.env.PORT || 3001; // use external server port OR local 3000
const app = express(); //instantiate express
const cors = require("cors");
const authController = require("./Controllers/authController");
require("./DB/mongoose"); //ensures mongoos connects and runs
const posts = require("./Routes/api/post");
app.use("/api/posts", posts);
const user = require("./Routes/api/user");
app.use("/api/user", user);

//takes the raw requests and turns them into usable properties on req.body
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

const { auth, requiresAuth } = require("express-openid-connect");

const config = {
  authRequired: false,
  auth0Logout: true,
  baseURL: process.env.BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  secret: process.env.SECRET,
};

app.use(auth(config));
app.get("/", requiresAuth(), (req, res) => {
  res.send(req.oidc.isAuthenticated() ? `${req.oidc.user.name}` : "Logged out");
  console.log(req.oidc.user);
});

app.listen(port, () => {
  console.log(`Server is up on ${port}`);
});
