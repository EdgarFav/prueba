import express from 'express'
import { createTask, getTasks } from '../controllers/task.js'

const taskRouter = express.Router();

taskRouter.post('/task', createTask);
taskRouter.get('/task', getTasks);

export default taskRouter;