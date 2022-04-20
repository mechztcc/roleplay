import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import User from 'App/Models/User'

export default class UsersController {
  public async store({ response, request }: HttpContextContract) {
    const payload = request.only(['email', 'username', 'password', 'avatar'])

    const userExists = await User.findBy('email', payload.email)
    if (userExists) {
      throw new BadRequestException('Email already in use', 409)
    }

    const userNameExists = await User.findBy('username', payload.username);
    if(userNameExists) {
      throw new BadRequestException('User name already in use', 409)
    }

    const user = await User.create(payload)
    return response.status(201).send(user)
  }
}
