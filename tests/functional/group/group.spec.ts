import { test } from '@japa/runner'

test.group('Group group', () => {
  test('It should be create a group with successfully', async ({ client, assert}) => {

    const response = await client.post('/groups').json({})

    response.assertStatus(201)
  })
})
