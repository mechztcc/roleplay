import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'

test.group('Group group', () => {
  test('It should be create a group with successfully', async ({ client, assert }) => {
    const user = await UserFactory.create()

    const groupPayload = {
      name: 'test',
      description: 'test',
      schedule: 'test',
      location: 'test',
      chronic: 'test',
      master: user.id,
    }

    const response = await client.post('/groups').json(groupPayload)

    response.assertStatus(201)
    response.assertBodyContains({ master: user.id, id: 1, players: [] })
  })

  test('It should return 422 when required data its not provided', async ({ client }) => {
    const response = await client.post('/groups').json({})

    response.assertStatus(422)

    response.assertBodyContains({
      code: 'BAD_REQUEST',
      status: 422,
      message: 'E_VALIDATION_FAILURE: Validation Exception',
      errors: [],
    })
  })
})
