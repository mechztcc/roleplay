import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import CreateSessionValidator from 'App/Validators/CreateSessionValidator'

export default class SessionsController {
  public async store({ request, response, auth }: HttpContextContract) {
    const payload = await request.validate(CreateSessionValidator)

    const user = await User.findByOrFail('email', payload.email)

    await auth.attempt(payload.email, payload.password)

    return response.created({ user: auth.user })
  }
}
