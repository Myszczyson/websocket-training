import React from 'react';
import io from 'socket.io-client';
import { v4 as uuid_v4 } from "uuid";



class App extends React.Component {
  constructor() {
    super()

    this.state = {
      tasks: [],
    }
  }

  componentDidMount(){
    this.socket = io()
    this.socket.connect("http://localhost:8000/");
    this.socket.on('updateData', (tasks) => this.updateData(tasks))
    this.socket.on('addTask', ({id, name}) => this.addTask(id, name))
    this.socket.on('removeTask', ({id}) => this.removeTask(id))
  }

  updateData(tasks){
    this.setState({
      tasks: tasks
    })
  }

  addTask(id, name){
    this.setState({
      tasks: [...this.state.tasks, {id, name}],
    })
    this.socket.emit('addTask', ({id, name}))
  }

  removeTask(e, id){
    e.preventDefault();
    this.setState({
      tasks: this.state.tasks.filter(task => task.id !== id)
    })
    this.socket.emit('removeTask', ({id}))
  }

  submitForm(e, id, name){
    e.preventDefault()
    this.addTask(id, name)
  }

  render() {

    const taskName = document.getElementById('task-name')

    return (
      <div className="App">
    
        <header>
          <h1>ToDoList.app</h1>
        </header>
    
        <section className="tasks-section" id="tasks-section">
          <h2>Tasks</h2>
    
          <ul className="tasks-section__list" id="tasks-list">
            {this.state.tasks.map(task => (
              <li class="task"  id={task.id}>{task.name}<button class="btn btn--red" onClick={(e) => this.removeTask(e, task.id)}>Remove</button></li>
              ))}
          </ul>
    
          <form id="add-task-form" onSubmit={(e) => this.submitForm(e, uuid_v4(), taskName.value)}>
            <input 
              className="text-input" 
              autocomplete="off" type="text" 
              placeholder="Type your description" 
              id="task-name"
            />
            <button className="btn" type="submit">Add</button>
          </form>
    
        </section>
      </div>
    );
  };

};

export default App;