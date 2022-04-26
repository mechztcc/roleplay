import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Group from 'App/Models/Group'
import GroupsCreateValidator from 'App/Validators/GroupsCreateValidator'

export default class GroupsController {
  public async store({ request, response }: HttpContextContract) {
    const payload = await request.validate(GroupsCreateValidator)

    const group = await Group.create(payload)
    await group.related('players').attach([payload.master])

    await group.load('players')

    return response.created(group)
  }

  public async update({ request, response}: HttpContextContract) {
    const payload = request.all()
  }
}
