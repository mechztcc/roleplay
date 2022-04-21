import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

 
  public schema = schema.create({
    email: schema.string({}, [rules.email()]),
    password: schema.string({}, [rules.minLength(6)]),
    avatar: schema.string({})
  })

  public messages = {}
}
