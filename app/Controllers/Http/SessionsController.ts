import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateSessionValidator from 'App/Validators/CreateSessionValidator'

export default class SessionsController {
  public async store({ request, response, auth }: HttpContextContract) {
    const payload = await request.validate(CreateSessionValidator)

    const token = await auth
      .use('api')
      .attempt(payload.email, payload.password, { expiresIn: '2hours' })

    return response.created({ user: auth.user, token: token })
  }

  public async destroy({ response, auth }: HttpContextContract) {
    await auth.logout()
    return response.ok({})
  }
}
