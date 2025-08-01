const Database = require("better-sqlite3");
const express = require('express');
const tasksdb = new Database("tasks.db");
const tasks = express.Router();

const middleWare = (req, res, next) => {
    console.log(req.body);
    next();
}

tasks.use(middleWare);

tasks.post("/new", (req, res) => {
    const {username, task, description} = req.body;
    if(!task){
        res.status(400).json({
            error: "Missing task"
        })
    }
    if(!description){
        res.status(400).json({
            error: "Missing description"
        })
    }
    tasksdb.prepare(`CREATE TABLE IF NOT EXISTS ${username} (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        task TEXT,
        description TEXT)`).run();
    const result = tasksdb.prepare(`INSERT INTO ${username} (task, description) VALUES(?, ?)`).run(task, description);
    const allTasks = tasksdb.prepare(`SELECT * FROM ${username}`).all();
    if(result.changes>0){
        res.status(200).json({
            success: true, 
            message:`${task} inserted into task list`, 
            allTasks: allTasks
    })
}});

tasks.post("/", (req, res) => {
    const {username} = req.body;
    const allTasks = tasksdb.prepare(`SELECT * FROM ${username}`).all();
    if(allTasks){
        res.status(200).json({
            tasks: allTasks
        });
    }
});

tasks.get("/users", (req, res) => {
    const users = tasksdb.prepare(`SELECT name FROM sqlite_master WHERE type='table'`).all();
    res.status(200).json({
        message: "Got all users with task lists", 
        users: users
    })
})

tasks.delete("/dropuser/:username", (req, res) => {
    const {username} = req.params;
    tasksdb.prepare(`DROP TABLE ${username}`).run();
    res.status(200).json({
        message: `${username} tasks table dropped`
    })
})

tasks.delete("/delete", (req, res)=> {
    const username = req.query.username;
    const id = req.query.id;
    const result = tasksdb.prepare(`DELETE FROM ${username} WHERE id=${id}`).run()
    const allTasks = tasksdb.prepare(`SELECT * FROM ${username}`).all();
    if(result.changes>0){
        console.log(`Deleted id # ${id} from ${username} tasks`)
    res.status(200).json({
        message: `Successfully deleted id #${id}`,
        tasks: allTasks
    });}
});


module.exports = tasks;