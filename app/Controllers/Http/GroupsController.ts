import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Group from 'App/Models/Group'
import GroupsCreateValidator from 'App/Validators/GroupsCreateValidator'

export default class GroupsController {
  public async store({ request, response }: HttpContextContract) {
    const payload = await request.validate(GroupsCreateValidator)

    const group = await Group.create(payload)
    return response.created(group)
  }
}
