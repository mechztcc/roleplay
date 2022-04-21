import Mail from '@ioc:Adonis/Addons/Mail'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { randomBytes } from 'crypto'
import { promisify } from 'util'

export default class PasswordsController {
  public async forgot({ request, response }: HttpContextContract) {
    const payload = request.only(['email', 'resetPasswordUrl']);

    const user = await User.findByOrFail('email', payload.email)

    const random = await promisify(randomBytes)(24)
    const token = random.toString('hex')

    await user.related('tokens').updateOrCreate({ userId: user.id }, { token: token })

    const resetPasswordUrl = `resetPasswordUrl?token=${token}`

    await Mail.send((message) => {
      message
        .from('no-replay@roleplay.com')
        .to(payload.email)
        .subject('Roleplay: Recuperação de senha')
        .htmlView('forgotpassword', { url: resetPasswordUrl })
    })
    return response.noContent()
  }
}
