import { test } from '@japa/runner'

test.group('Group request', () => {
  test('It should create a group request', async ({ client, assert}) => {

    const response = await client.post('/groups/1/requests')

    response.assertStatus(201)
  })
})
