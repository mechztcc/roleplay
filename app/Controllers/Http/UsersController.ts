import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class UsersController {
  public async store({ response, request }: HttpContextContract) {
    const payload = request.only(['email', 'username', 'password', 'avatar'])

    const userExists = await User.findBy('email', payload.email)
    if (userExists) {
      return response.conflict({ message: 'Email already in use ' })
    }

    const user = await User.create(payload)
    return response.status(201).send(user)
  }
}
