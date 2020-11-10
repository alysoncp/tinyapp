const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");

function generateRandomString() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for ( var i = 0; i < 6; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls", (req, res) => {
  console.log(req.body);  // Log the POST request body to the console
  const generatedURL = generateRandomString();
  urlDatabase[generatedURL] = req.body["longURL"];
  console.log(urlDatabase)
  res.redirect(`/urls/${generatedURL}`);  
});

app.post("/urls/:shortURL/delete", (req, res) => {
  console.log("Deleted");
  console.log(req.params)
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls/`);
});

app.post("/urls/:shortURL/update", (req, res) => {
  console.log("Updated");
  console.log(req.body)
  const shtURL = req.params.shortURL
  console.log(shtURL)
  urlDatabase[shtURL] = req.body.longURL;
  res.redirect(`/urls/`)
});

// app.get("/urls/:shortURL", (req, res) => {
//   const longURL = urlDatabase[req.params.shortURL]
//   res.redirect(longURL);
// });

app.get("/urls/:shortURL", (req, res) => {
  //console.log(urlDatabase[req.params.shortURL]);
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});



/* practice pages

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});
*/

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});