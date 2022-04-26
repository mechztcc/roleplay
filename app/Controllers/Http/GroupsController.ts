import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
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

  public async update({ request, response }: HttpContextContract) {
    const id = request.param('id')
    const payload = request.all()

    const group = await Group.findOrFail(id)

    const updatedGroup = await group.merge(payload).save()

    return response.ok({ updatedGroup })
  }

  public async removePlayer({ request, response }: HttpContextContract) {
    const groupId = request.param('groupId')
    const playerId = +request.param('playerId') // '+' convert the value to number

    const group = await Group.findOrFail(groupId)

    if (playerId === group.master) {
      throw new BadRequestException('cannot remove master from group', 400)
    }

    group.related('players').detach([playerId])
    return response.ok({})
  }

  public async destroy({ request, response}: HttpContextContract) {
    return response.ok({})
  }
}
