// import { TodosAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
// import { TodoItem } from '../models/TodoItem'
// import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { getUserId } from '../lambda/utils'
// import * as createError from 'http-errors'

import { CreateTodoRequest } from '../requests/CreateTodoRequest'

// ✅TODO: Implement businessLogic
export function buildTodo(todoRequest: CreateTodoRequest, event) {
  const todo = {
    todoId: uuid.v4(),
    createdAt: new Date().toISOString(),
    userId: getUserId(event),
    attachmentUrl: '',
    // attachmentUrl: `https://${s3BucketName}.s3.amazonaws.com/${todoId}`,
    done: false,
    ...todoRequest
  }

  return todo
}
