const express = require('express');
const users = express.Router();
const Database = require("better-sqlite3");
const usersdb = new Database("users_database.db");
const bcrypt = require('bcrypt');

users.get('/', (req, res) => {
    const allUsers = usersdb.prepare(`SELECT name FROM sqlite_master WHERE type='table'`).all();
    res.status(200).json({
        users: allUsers
    });
})

users.post('/create', async (req, res) => {
    const { username, password, email } = req.body;
    usersdb.prepare(`CREATE TABLE IF NOT EXISTS ${username} (
        username TEXT,
        password TEXT, 
        email TEXT)`
    ).run();
    const hash_password = await bcrypt.hash(password, 10);
    console.log(password);
    console.log(hash_password);
    usersdb.prepare(`INSERT INTO ${username} (username, password, email) VALUES (?,?,?)`).run(username, hash_password, email)
    const user = usersdb.prepare(`SELECT * FROM ${username}`).all();
    res.status(200).json({
        message: "User created!",
        user: user
    })
});

users.post("/login", async (req, res) => {
    const {username, password} = req.body;
    const user = usersdb.prepare(`SELECT * FROM ${username}`).get();
    if(!user){
        res.status(404).send("User not found");
    }
    const auth = await bcrypt.compare(password, user.password);
    if(auth){
        res.status(200).json({
        success: true,
        user: user
    });}
    else{
        res.status(400).send("Incorrect username or password")
        };
    }
    )

module.exports = users;