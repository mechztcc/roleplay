import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'

test.group('Group group', () => {
  test('It should be create a group with successfully', async ({ client, assert}) => {

    const user = await UserFactory.create();
    
    const groupPayload = {
      name: 'test',
      description: 'test',
      schedule: 'test',
      location: 'test',
      chronic: 'test',
      master: user.id
    }

    const response = await client.post('/groups').json(groupPayload)

    const body = response.body()
  
    response.assertStatus(201)
    response.assertBodyContains({ master: user.id, id: 1 })
  })
})
