import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUserId } from '../utils'
import { deleteToDo } from '../../helpers/todosAcess'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)

    const deletedData = await deleteToDo(todoId, userId)

    return {
      statusCode: 200,
      // headers: {
      //   'Access-Control-Allow-Origin': '*'
      // },
      body: deletedData
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
