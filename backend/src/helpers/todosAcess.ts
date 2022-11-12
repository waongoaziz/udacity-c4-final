import * as AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
// import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate';
const AWSXRay = require('aws-xray-sdk')

const XAWS = AWSXRay.captureAWS(AWS)
// const logger = createLogger('TodosAccess')
const docClient: DocumentClient = createDynamoDBClient()
const todoTable = process.env.TODOS_TABLE
const indexName = process.env.TODOS_CREATED_AT_INDEX

// // ✅TODO: Implement the dataLayer logic
export const createTodo = async (todoItem: TodoItem): Promise<TodoItem> => {
  console.log('Creating new todo')

  const params = {
    TableName: todoTable,
    Item: todoItem
  }

  const result = await docClient.put(params).promise()
  console.log(result)

  return todoItem as TodoItem
}

export async function getAllToDosByUserId(userId: string): Promise<TodoItem[]> {
  const result = await docClient
    .query({
      TableName: todoTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    })
    .promise()
  return result.Items as TodoItem[]
}
export async function getTodoById(todoId: string): Promise<TodoItem> {
  const result = await docClient
    .query({
      TableName: todoTable,
      IndexName: indexName,
      KeyConditionExpression: 'todoId = :todoId',
      ExpressionAttributeValues: {
        ':todoId': todoId
      }
    })
    .promise()

  const items = result.Items
  if (items.length !== 0) {
    return items[0] as TodoItem
  }
  return null
}
export async function updateToDo(
  todoId: string,
  todo: TodoItem
): Promise<TodoItem> {
  const params = {
    TableName: todoTable,
    Key: {
      userId: todo.userId,
      todoId: todoId
    },
    UpdateExpression: 'set attachmentUrl = :attachmentUrl',
    ExpressionAttributeValues: {
      ':attachmentUrl': todo.attachmentUrl
    },
    ReturnValues: 'ALL_NEW'
  }

  const result = await docClient.update(params).promise()
  const attributes = result.Attributes

  return attributes as TodoItem
}

export async function deleteToDo(
  todoId: string,
  userId: string
): Promise<string> {
  const params = {
    TableName: todoTable,
    Key: {
      userId: userId,
      todoId: todoId
    }
  }

  const result = await docClient.delete(params).promise()
  console.log(result)

  return '' as string
}

export function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
