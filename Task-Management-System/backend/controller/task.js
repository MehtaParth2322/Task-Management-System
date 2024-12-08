const Task = require('../model/task');

exports.getTasks = async (req, res) => {
    await Task.find({ }).then(data => {
        res.status(200).send(data)
     }).catch(err => {
        res.status(500).send({
            message: err.message || "Error while finding a Tasks"
        })
    })
};

exports.getTasksByTaskId = async (req, res) => {

    const taskId = req.params.id;

    await Task.find({_id: taskId}).then(data => {
        res.status(200).send(data)
     }).catch(err => {
        res.status(500).send({
            message: err.message || "Error while finding a Tasks"
        })
    })
};

exports.getTasksByUser = async (req, res) => {

    const userId = req.params.id;

    await Task.find({userId}).then(data => {
        res.status(200).send(data)
     }).catch(err => {
        res.status(500).send({
            message: err.message || "Error while finding a Tasks"
        })
    })
};

exports.createTask = async (req, res) => {

    const { title, description, dueDate, priority, status, userId } = req.body;
    const newTask = new Task({ title, description, dueDate, priority, status, userId});

    await newTask.save(newTask);
    res.status(200).json(newTask);
};

exports.updateTask = async (req, res) => {
    const updatedTask = await Task.findOneAndUpdate(
        { _id: req.params.id},
        req.body,
        { new: true }
    );
    if (!updatedTask) return res.status(404).json({ error: 'Task not found' });
    res.json(updatedTask);
};

exports.deleteTask = async (req, res) => {
    const deletedTask = await Task.findOneAndDelete({ _id: req.params.id });
    if (!deletedTask) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json();
};