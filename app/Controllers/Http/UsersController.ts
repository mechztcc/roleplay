import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  public async store({ response, request }: HttpContextContract) {
    const payload = request.only(['email', 'username', 'password', 'avatar']);


  }
}
