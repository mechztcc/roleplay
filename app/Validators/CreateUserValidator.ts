import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

 
  public schema = schema.create({
    username: schema.string(),
    password: schema.string({}, [rules.minLength(6)]),
    email: schema.string({}, [rules.email()]),
  })

  public messages = {}
}
