import './App.css';
import React, {useEffect, useState} from "react";

const App = () => {
  const [tasks, setTasks] = useState([]);

  const getTasks = async () => {
    const result = await fetch("http://localhost:3030/tasks", {method:"POST", body:JSON.stringify({"username": "eqm31326"})});
    console.log(result.tasks);
    setTasks(result.tasks);
  }
  useEffect(() => {
    getTasks();
  },[])

  return (
    <div className="App">
        <div>
        <ul>
          {tasks.map((task, index) => <li key={task.id} value={task.task}>{task.task}</li>)}
        </ul>
        </div>
    </div>
  );
}

export default App;
