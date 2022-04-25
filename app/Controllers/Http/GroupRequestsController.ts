import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BadRequestException from 'App/Exceptions/BadRequestException'
import Group from 'App/Models/Group'
import GroupRequest from 'App/Models/GroupRequest'

export default class GroupRequestsController {
  public async store({ request, response, auth }: HttpContextContract) {
    const groupId = request.param('groupId') as number
    const userId = auth.user!.id

    const requestExists = await GroupRequest.query()
      .where('groupId', groupId)
      .andWhere('userId', userId)
      .first()

    if (requestExists) {
      throw new BadRequestException('group request already exists', 409)
    }

    const userGroupExists = await Group.query()
      .whereHas('players', (query) => {
        query.where('id', userId)
      })
      .andWhere('id', groupId)
      .first()

    if (userGroupExists) {
      throw new BadRequestException('user is already in this group')
    }

    const groupRequest = await GroupRequest.create({ groupId, userId })
    await groupRequest.refresh()
    return response.created(groupRequest)
  }

  public async index({ request, response }: HttpContextContract) {
    return response.accepted({})
  }
}
