import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'

test.group('Users sessions', () => {
  test('It should authenticate an user', async ({ client, assert }) => {
    const plainPassword = '123456'
    const user = await UserFactory.merge({ password: plainPassword }).create()

    const response = await client
      .post('/sessions')
      .json({ email: user.email, password: plainPassword })

    const body = response.body()  

    response.assertStatus(201)
    assert.equal(body.user.id, user.id, 'User undefined')
  })

  // test('Its should')
})
