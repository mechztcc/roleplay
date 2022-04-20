import { test } from '@japa/runner';
// import { execaNode } from 'execa';


test.group('Users user', () => {
  test('Its should be create a user', async ({ client, assert }) => {
    const userPayload = {
      email: 'email@email.com',
      password: '123456',
      username: 'Alberto',
      avatar: 'http://images.com/images/1',
    }

    const response = await client.post('/users').json(userPayload)
    const body = response.body()
    response.assertStatus(201)

    assert.exists(body.id, 'Failed to create user')
  })
    .setup(async () => {
      // await execaNode('ace', ['migration:run'])
    })
    .teardown(() => {
      console.log('desfaz a migration aqui')
    })
})
