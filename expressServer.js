const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

const users = { 
  "user1": {
    id: "user1", 
    email: "user1@example.com", 
    password: "1234"
  },
 "xyz": {
    id: "xyz", 
    email: "xyz@example.com", 
    password: "1234"
  },
  "abc": {
    id: "abc", 
    email: "abc@example.com", 
    password: "1234"
  }
}

const urlDatabase = {
  "b2xVn2": { longURL: "http://www.lighthouselabs.ca", userID: "abc"},
  "9sm5xK": { longURL: "http://www.google.com", userID: "xyz"},
  "4j3SJg": { longURL: "http://www.formula1.com", userID: "user1"},
  "b6UTxQ": { longURL: "https://www.tsn.ca", userID: "xyz" },
  "i3BoGr": { longURL: "https://www.google.ca", userID: "abc" },


};


function generateRandomString() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( var i = 0; i < 6; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function emailCheck(newEmail){
  for (user in users){
    if (users[user].email === newEmail){
      return users[user]
    }
  }
  return undefined;
}

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser())


// -------------- GETS and POSTS ---------------------------

app.get("/urls/login", (req, res) => {
  const currentUser = req.cookies["id"]
  console.log(`current user: ${currentUser}`)
  const templateVars = { user: users[currentUser], urls: urlDatabase };
  console.log("Rendering login page");
  res.render("urls_login", templateVars)
});


app.post("/urls/login", (req, res) => {
  console.log("Logged in!");
  console.log(req.body.email);
  user = emailCheck(req.body.email)
  if (user && user.password === req.body.password){
    console.log("matching email and password");
    res.cookie('id', user.id)
  } else if (user){
    res.status(403);
    res.send(`Error Code ${res.statusCode}: Wrong password`)
  } else {
    res.status(403);
    res.send(`Error Code ${res.statusCode}: That email doesn't exist!`)
  }
  console.log(req.cookies);
  res.redirect(`/urls/`);
});

app.post("/urls/logout", (req, res) => {
  console.log("Logged out!");
  res.clearCookie('id');
  res.redirect(`/urls/`);
});

app.get("/urls", (req, res) => {
  // console.log(res.status);
  const currentUser = req.cookies["id"]
  console.log(currentUser);
  console.log(users[currentUser]);
  const templateVars = { user: users[currentUser], urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const generatedURL = generateRandomString();
  urlDatabase[generatedURL] = req.body["longURL"];
  res.redirect(`/urls/`);  
});

app.get("/urls/new", (req, res) => {
  console.log("newURL")
  const currentUser = req.cookies["id"]
  console.log(currentUser)
  if (currentUser) {
    const templateVars = { user: users[currentUser]};
    res.render("urls_new", templateVars);
  } else {
    const templateVars = { user: users[currentUser], urls: urlDatabase };
    res.render("urls_login", templateVars);
  }
});


app.get("/urls/register", (req, res) => {
  const currentUser = req.cookies["id"]
  const templateVars = { user: users.currentUser, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_register", templateVars);
});

app.post("/urls/register", (req, res) => {
  const newID = generateRandomString();

  if (req.body["email"] === '' || req.body["password"] === '') {
    res.status(400);
    res.send(`Error Code ${res.statusCode}: Fields can't be blank!`)
  } else if (emailCheck(req.body["email"])) {  
    res.status(400);
    res.send(`Error Code ${res.statusCode}: That email already exists!`)
  } else  {
    users[newID] = {
      id : newID,
      email: req.body["email"], 
      password: req.body["password"],
    };
    res.cookie('id', newID);
    console.log(users)
    console.log("registered");
    res.redirect(`/urls/`);
  }

});

app.post("/urls/:shortURL/delete", (req, res) => {
  console.log("Deleted");
  console.log(req.params)
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls/`);
});

app.get("/urls/:shortURL/update", (req, res) => {
  const currentUser = req.cookies["id"]
  const templateVars = { user: users.currentUser, shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL/update", (req, res) => {
  console.log("Updated");
  console.log(req.body)
  const shtURL = req.params.shortURL
  console.log(shtURL)
  urlDatabase[shtURL] = req.body.longURL;
  res.redirect(`/urls/`)
});

app.get("/urls/:shortURL", (req, res) => {
  console.log(req.params.shortURL)
  const longURL = urlDatabase[req.params.shortURL].longURL
  console.log(longURL)
  res.redirect(longURL);
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

