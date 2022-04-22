import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import { Exception } from '@adonisjs/core/build/standalone'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async handle(error: Exception, ctx: HttpContextContract) {
    if (error.status === 422) {
      return ctx.response.status(error.status).send({
        code: 'BAD_REQUEST',
        message: error.message,
        status: error.status,
        errors: error['messages']?.errors ? error['messages'].errors : ''
      })
    }
    else if(error.message === 'E_ROW_NOT_FOUND: Row not found') {
      return ctx.response.status(error.status).send({
        code: 'BAD_REQUEST',
        message: 'Resource not found',
        status: 404,
      })
    }
    else if(error.message === 'E_INVALID_AUTH_UID: User not found') {
      return ctx.response.status(error.status).send({
        code: 'BAD_REQUEST',
        message: 'Invalid credentials',
        status: 400,
      })
    }
    return super.handle(error, ctx)
  }
}
