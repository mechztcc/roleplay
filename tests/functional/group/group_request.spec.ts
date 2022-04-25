import { test } from '@japa/runner'
import { GroupFactory, UserFactory } from 'Database/factories'

test.group('Group request', () => {
  test('It should create a group request', async ({ client, assert}) => {

    const master = await UserFactory.create();
    const group = await GroupFactory.merge({ master: master.id}).create()

    const response = await client.post(`/groups/${group.id}/requests`)

    response.assertStatus(201)
  })
})
