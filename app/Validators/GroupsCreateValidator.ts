import { schema, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GroupsCreateValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({}, []),
    description: schema.string({}, []),
    schedule: schema.string({}, []),
    location: schema.string({}, []),
    chronic: schema.string({}, []),
    master: schema.number(),
  })

  public messages = {}
}
