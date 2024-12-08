const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        required: true 
    },
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    dueDate: { 
        type: Date
    },
    priority: { 
        type: String,
        enum: ['low', 'medium', 'high'], 
        default: 'low' 
    },
    status: { 
        type: String, 
        enum: ['pending', 'in progress', 'completed'], 
        default: 'pending' 
    },
});

module.exports = mongoose.model('Task', TaskSchema);