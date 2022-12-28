require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
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

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

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
    const userNameLogin = req.body.username;
    const passwordLogin = req.body.password;
    user.findOne(
        { email: userNameLogin },
        function (err, foundEmail) {
            if (!err) {
                if (foundEmail) {
                    if (foundEmail.password === passwordLogin) {
                        console.log("Succefully login.");
                        res.render("secrets");
                    } else {
                        console.log("Wrong Password.");
                        res.redirect("/login");
                    } 
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
    const userdata = new user({
        email: req.body.username,
        password: req.body.password
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

app.listen(3000, function () {
    console.log("Server started on port 3000");
});