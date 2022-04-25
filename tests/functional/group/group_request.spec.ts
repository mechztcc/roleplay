import { test } from '@japa/runner'

test.group('Group request', () => {
  test('It should create a group request', async ({ client, assert}) => {

    const response = await client.post('/group/1/request')

    response.assertStatus(201)
  })
})
