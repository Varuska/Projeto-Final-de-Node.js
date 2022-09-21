const express = require('express')
const { Sequelize, DataTypes } = require('sequelize')
const Task = require('./models/task')

const app = express()
const sequelize = new Sequelize({ dialect: 'sqlite', storage: './task-list.db' })
const tasks = Task(sequelize, DataTypes)

// We need to parse JSON coming from requests
app.use(express.json())

// List tasks

app.get('/tasks', async (req, res) => {

 try{

  const toTask = await tasks.findAll()

  res.json({ toTask })

 }catch(err) { 

  res.status(500).json({message: err.message})
 
 }

});  

// Create task

app.post('/tasks', async(req, res) => {
   
  const description = req.body.description

  const done = req.body.done 

  const cadastrarTask = await tasks.findOne({ description : description, done: done })

    if(cadastrarTask === null ) {

      return res.status(400).json({error: 'TAREA JA ESTÁ CADASTRADA'})

    }

    try{

      const newTask = await tasks.create({ description : description, done: done })

      res.status(200).json(newTask)

    } catch(err) {

      res.status(500).json({message: err.message})

  }

});

// Show task

app.get('/tasks/:id', async(req, res) => {

  const taskId = req.params.id

  const semTask = await tasks.findByPk(( taskId ))

  if(semTask == null) {

    return res.status(400).json({message: 'TEM QUE INSERIR UM VALOR EXISTENTE DE ID'})

  }

  try { 

    const achandoTask = await tasks.findByPk(( taskId ))

    res.status(200).json({achandoTask })

} catch(err) {

    res.status(500).json({message: err.message})

}

});

// Update task

app.put('/tasks/:id', async (req, res) => {

  const taskId = req.params.id
  const description = req.body.description
  const done =  req.body.done

  const achandoTask = await tasks.findByPk(taskId)

  if(achandoTask == null ) {

    return res.status(404).json({message: 'Id NÃO ENCONTRADO'})

  }

  try {

   const task = await tasks.findByPk(taskId)
    task.update({description: description, done: done})

   res.json({ taskId: 'Atualizado com sucesso' })
  
  }catch (err) {

    res.status(500).json({message: err.message});  

  }

});

// Delete task

app.delete('/tasks/:id', async(req, res) => {

  const taskId = req.params.id

  const achandoTask = await tasks.findByPk((taskId))

  if(achandoTask == null) {
    return res.status(404).json({message: 'ID NÃO ENCONTRADA'})
  }

  try{

    const deletTask = await tasks.destroy({where: { id : taskId}})

    res.json({taskId: 'Task excluida com sucesso' })
    
  }catch (err) {

    res.status(500).json({message: err.message});

  }
  
});

app.listen(3000, () => {
  console.log('Iniciando o ExpressJS na porta 3000')
});