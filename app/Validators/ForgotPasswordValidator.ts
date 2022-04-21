import { schema } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ForgotPasswordValidator {
  constructor(protected ctx: HttpContextContract) {}


  public schema = schema.create({
    email: schema.string(),
    resetPasswordUrl: schema.string()
  })

  public messages = {}
}
