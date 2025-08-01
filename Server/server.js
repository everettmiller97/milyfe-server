const express = require('express');
const cors = require('cors');

const app = express();
const port = 3030;
const users = require("./users");
const tasks = require("./tasks");

app.use(express.json());
app.use(cors());
app.use("/users", users);
app.use("/tasks", tasks);



app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})