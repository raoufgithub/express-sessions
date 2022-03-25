const express = require('express');
const router = express.Router();
const session = require('express-session');

const authentication = require('./midllewares/authentication');
const app = express();
const fs = require('fs');
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    name: 'cookietest',
  secret: 'SecretCodejazkjhalkjzhkajzh',
  resave: false,
  saveUninitialized: false,
  cookie: {
      maxAge: 1000 * 60 * 60, 
      sameSite: true,
      secure: false
     }
}))
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const { use } = require('express/lib/application');
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/login', (req,res) => {
   
    if (typeof(req.session.username) != "undefined"){
        console.log("user is already authenticated");
        res.redirect('/');
        return;
    }
    res.render('login');
});
app.post('/login', (req,res) => {
    
    const {username,password} = req;
    if (req.body["username"] === "" || 
    req.body["password"] === "") {
        res.redirect('/login');
        return;
    }
    let content;
    fs.readFile(__dirname + '/login.txt', 'utf8', function(err, data) {
        if (err) throw err;
        content = JSON.parse(data);
        const user = content.find(user => user.username === req.body["username"] 
                    && user.password === req.body["password"]);
        console.log(user);
        console.log(user);
        if (!user){
            res.redirect('/login');
            return;
        }
        else {
            req.session.username = user.username;
            
            console.log("username : " + req.session.username);
            res.redirect('/');
            return;
        }
        
    });
    
});

app.get('/register', (req,res) => {
   
    if (typeof(req.session.username) != "undefined"){
        console.log("user is already authenticated");
        res.redirect('/');
        return;
    }
    res.render('register');
});

app.post('/register', (req,res) => {
    
    const {username,password} = req;
    if (req.body["username"] === "" || 
    req.body["password"] === "" || req.body["password_confirm"] === "") {
        res.redirect('/register');
        return;
    }
    else {
        if (req.body["password"] !== req.body["password_confirm"]) {
            console.log("password different then confirmation password")
            return res.redirect('/register');
        }
    }
    let content;
    fs.readFile(__dirname + '/login.txt', 'utf8', function(err, data) {
        if (err) throw err;
        content = JSON.parse(data);
        const user = content.find(user => user.username === req.body["username"] 
                    && user.password === req.body["password"]);
        console.log(user);
        console.log(user);
        if (user){
            console.log("user already exist");
            return res.redirect('/register');
        }
        else {
            const newUser = {"username" : req.body["username"], "password" : req.body["password"]};
            console.log("username : " + newUser);
            content.push(newUser);

            fs.writeFile(__dirname + '/login.txt', JSON.stringify(content) , function (err) {
                if (err) throw err;
                req.session.username = newUser.username;
            
                console.log("test for github")
                return res.redirect('/');
            });

            
        }
        
    });
    
});

app.use(authentication);

app.get('/', (req,res) => {
    console.log("Request has been made");

    let content;
    fs.readFile(__dirname + '/requestPost.txt', 'utf8', function(err, data) {
        if (err) throw err;
        content = JSON.parse(data);
        
        res.render('index', {
            book: content,
        });
    });
    
});
app.get('/add', (req,res) => {
    
    res.render('add');
});

app.post('/add', (req,res) => {
    console.log(req.body);
    if (req.body["name-book"] === "" || 
    req.body["name-author"] === ""
    || req.body["nbre-pge"] === "") {
        res.redirect('/');
        return;
    }
    let content;
    fs.readFile(__dirname + '/requestPost.txt', 'utf8', function(err, data) {
        if (err) throw err;
        content = JSON.parse(data);
        content.push(req.body);
        fs.writeFile(__dirname + '/requestPost.txt', JSON.stringify(content) , function (err) {
            if (err) throw err;
            console.log('Fichier créé !');
            res.redirect('/');
        });
        
    });
    
});

app.post('/logout', (req,res) => {
    req.session.destroy(err =>{
        if (err){
            return res.redirect("/");
        }
    });
    res.clearCookie("cookietest");
    res.redirect("/login");
});

app.listen(port, () => console.log("connection established : http://localhost:" + port));