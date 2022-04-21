import Mail from '@ioc:Adonis/Addons/Mail'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PasswordsController {
  public async forgot({ request, response }: HttpContextContract) {
    const email = request.only(['email']) as unknown as string // ??? whats is it!!!

    const msg = await Mail.send((message) => {
      message
        .from('no-replay@roleplay.com')
        .to(email)
        .subject('Roleplay: Recuperação de senha')
        .htmlView('forgotpassword')
    })
    return response.noContent()
  }
}
