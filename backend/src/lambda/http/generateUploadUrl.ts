import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getTodoById, updateToDo } from '../../helpers/todosAcess'
import { generateUploadUrl } from '../../helpers/attachmentUtils'

const s3BucketName = process.env.ATTACHMENT_S3_BUCKET

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const todo = await getTodoById(todoId)
    todo.attachmentUrl = `https://${s3BucketName}.s3.amazonaws.com/${todoId}`
    updateToDo(todoId, todo)

    const URL = await generateUploadUrl(todoId)

    return {
      statusCode: 202,
      // headers: {
      //   'Access-Control-Allow-Origin': '*'
      // },
      body: JSON.stringify({
        uploadUrl: URL
      })
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
