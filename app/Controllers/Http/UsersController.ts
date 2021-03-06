import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import User from 'App/Models/User'
import CreateUserValidator from 'App/Validators/CreateUserValidator'
import UpdateUserValidator from 'App/Validators/UpdateUserValidator'

export default class UsersController {
  public async store({ response, request }: HttpContextContract) {
    const payload = await request.validate(CreateUserValidator)

    const userExists = await User.findBy('email', payload.email)
    if (userExists) {
      throw new BadRequestException('Email already in use', 409)
    }

    const userNameExists = await User.findBy('username', payload.username)
    if (userNameExists) {
      throw new BadRequestException('User name already in use', 409)
    }

    const user = await User.create(payload)
    return response.status(201).send(user)
  }

  public async update({ response, request }: HttpContextContract) {
    const payload = await request.validate(UpdateUserValidator)

    const id = request.param('id')
    
    const userExists = await User.findOrFail(id)

    userExists.email = payload.email
    userExists.password = payload.password
    userExists.avatar = payload.avatar

    await userExists.save()

    return userExists
  }
}
