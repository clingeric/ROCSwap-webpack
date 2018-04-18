const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + "/public"));

const env = process.env.NODE_ENV || "development";
const config = require("./knexfile")[env];
const knex = require("knex")(config);

// jwt setup
const jwt = require("jsonwebtoken");
let jwtSecret = process.env.jwtSecret;
if (jwtSecret === undefined) {
  console.log(
    "You need to define a jwtSecret environment variable to continue."
  );
  knex.destroy();
  process.exit();
}

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).send({ error: "No token provided." });
  jwt.verify(token, jwtSecret, function(err, decoded) {
    if (err)
      return res.status(500).send({ error: "Failed to authenticate token." });
    // if everything good, save to request for use in other routes
    req.userID = decoded.id;
    next();
  });
};

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

let bcrypt = require("bcrypt");
const saltRounds = 10;

let passes = [];
let id = 0;

let users = [];
let userId = 0;

let currentUser = "";

// Returns a list of available ROC passes
app.get("/api/passes", (req, res) => {
  knex("passes")
    .join("users", "users.id", "passes.user_id")
    .select(
      "passes.id",
      "fname",
      "lname",
      "email",
      "phone",
      "price",
      "availableFrom",
      "availableTo"
    )
    .then(passes => {
      res.status(200).json({ passes: passes });
    })
    .catch(err => {
      res.status(500).json({ err });
    });
});

// Adds a ROC pass
app.post("/api/passes/:id", verifyToken, (req, res) => {
  let id = parseInt(req.params.id);
  knex("users")
    .where("id", id)
    .first()
    .then(user => {
      return knex("passes").insert({
        user_id: id,
        price: req.body.price,
        availableFrom: req.body.availableFrom,
        availableTo: req.body.availableTo
      });
    })
    .then(pass => {
      res.status(200);
      return;
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ err });
    });
});

// Removes the user's posted pass(es)
app.delete("/api/passes/:id", verifyToken, (req, res) => {
  let id = parseInt(req.params.id);
  knex("passes")
    .where("id", id)
    .first()
    .del()
    .then(success => {
      res.sendStatus(200);
      return;
    })
    .catch(err => {
      res.status(500).json({ err });
    });
});

// Get my account
app.get("/api/me", verifyToken, (req, res) => {
  knex("users")
    .where("id", req.userID)
    .first()
    .select("email", "fname", "lname", "id")
    .then(user => {
      res.status(200).json({ user: user });
    })
    .catch(error => {
      res.status(500).json({ error });
    });
});

// Creates new user
app.post("/api/users", (req, res) => {
  if (
    !req.body.email ||
    !req.body.password ||
    !req.body.fname ||
    !req.body.lname ||
    !req.body.phone
  ) {
    return res.status(400).send();
  }
  knex("users")
    .where("email", req.body.email)
    .first()
    .then(user => {
      if (user !== undefined) {
        res.status(403).send("Email address already exists");
        throw new Error("abort");
      }
      return bcrypt.hash(req.body.password, saltRounds);
    })
    .then(hashed_password => {
      return knex("users").insert({
        email: req.body.email,
        hashed_password: hashed_password,
        fname: req.body.fname,
        lname: req.body.lname,
        phone: req.body.phone,
        created_at: new Date()
      });
    })
    .then(ids => {
      return knex("users")
        .where("id", ids[0])
        .first()
        .select("email", "fname", "lname", "phone");
    })
    .then(user => {
      let token = jwt.sign({ id: user.id }, jwtSecret, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.status(200).json({ user: user, token: token });
      return;
    })
    .catch(error => {
      if (error.message !== "abort") {
        console.log(error);
        res.status(500).json({ error });
      }
    });
});

// TODO:

// Edits user details
app.put("/api/users/:id", verifyToken, (req, res) => {
  let id = parseInt(req.params.id);
  if (
    // !req.body.fname ||
    // !req.body.lname ||
    // !req.body.phone ||
    // !req.body.email ||
    !req.body.password
  ) {
    return res.status(400).send();
  }
  return knex("users")
    .where("id", id)
    .update({
      fname: req.body.fname,
      lname: req.body.lname,
      phone: req.body.phone,
      email: req.body.email,
      hashed_password: bcrypt.hash(req.body.password, saltRounds)
    })
    .then(response => {
      console.log(response);
    })
    .catch(err => {
      res.status(500).json({ err });
    });
});

// Logs the user in
app.post("/api/login", (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send();
  }
  knex("users")
    .where("email", req.body.email)
    .first()
    .then(user => {
      if (user === undefined) {
        res.status(403).send("Invalid Credentials");
        throw new Error("abort");
      }
      return [bcrypt.compare(req.body.password, user.hashed_password), user];
    })
    .spread((result, user) => {
      if (result) {
        let token = jwt.sign({ id: user.id }, jwtSecret, {
          expiresIn: 86400 // expires in 24 hours
        });
        console.log(user);
        res.status(200).json({
          user: {
            email: user.email,
            fname: user.fname,
            lname: user.lname,
            phone: user.phone,
            id: user.id
          },
          token: token
        });
      } else {
        res.status(403).send("Invalid credentials");
      }
      return;
    })
    .catch(error => {
      if (error.message !== "abort") {
        res.status(500).json({ error });
      }
    });
});

app.listen(4000, () => console.log("Server listening on port 4000!"));
