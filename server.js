const express = require('express');
const socket = require('socket.io');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();

let tasks = [
  {id: uuidv4(), name: 'Do something'},
  {id: uuidv4(), name: 'Do something else'},
  {id: uuidv4(), name: 'Do something new'},
]

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname + '/client/build')));

app.get('/', (req, res) => {
  res.sendFile('index.html');
  console.log(tasks)
})

app.use((req, res) => {
  res.status(404).send({ message: 'Not found...' });
});


const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running...');
});

const io = socket(server);

io.on('connection', 
(socket) => {

  socket.emit('updateData', tasks)

  socket.on('addTask', (addTask) => {
    tasks.push(addTask)
    socket.broadcast.emit('updateData', tasks)
  })

  socket.on('removeTask', (removeTask) => {
    tasks = tasks.filter(task => task.id !== removeTask.id)
    socket.broadcast.emit('updateData', tasks)
  })
});