import { test } from '@japa/runner'

test.group('Users sessions', () => {
  test('It should authenticate an user', async({ client, assert }) => {

    const response = await client.post('/sessions')

    response.assertStatus(201)
  })
})
