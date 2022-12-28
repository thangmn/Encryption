require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
/*const encrypt = require("mongoose-encryption");*/
/*const md5 = require("md5");*/
const bcrypt = require("bcrypt");
const saltRounds = 10;
mongoose.set("strictQuery", true);

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://0.0.0.0:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

/*userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });*/

const user = mongoose.model("user", userSchema);


app.get("/", function (req, res) {
    res.render("home");
});
app.get("/login", function (req, res) {
    res.render("login");
});
app.get("/register", function (req, res) {
    res.render("register");
});

app.post("/login", function (req, res) {
    const userName = req.body.username;
    const password = req.body.password;
    user.findOne(
        { email: userName },
        function (err, foundEmail) {
            if (!err) {
                if (foundEmail) {
                    bcrypt.compare(password, foundEmail.password, function (err, result) {
                        if (result===true) {
                            console.log("Succefully login.");
                            res.render("secrets");
                        } else {
                            console.log("Wrong Password.");
                            res.redirect("/login");
                        } 
                    });
                    
                } else {
                    console.log("Wrong User Name.");
                    res.redirect("/login");
                };
            } else {
                console.log(err);
            }
        }
    );
});

app.post("/register", function (req, res) {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        const userdata = new user({
            email: req.body.username,
            password: hash
        })
        userdata.save(function (err) {
            if (!err) {
                console.log("Succefully register.");
                res.render("secrets");
            } else {
                console.log(err);
            }
        });
    });    
});

app.listen(3000, function () {
    console.log("Server started on port 3000");
});