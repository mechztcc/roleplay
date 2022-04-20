import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'

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
    assert.notExists(body.password, 'Password defined')
  })

  test('Its should return 409 when email is already in use', async ({ assert, client }) => {
    const { email } = await UserFactory.create()

    const response = await client.post('/users').json({
      email,
      username: 'test',
      password: '123456',
    })

    response.assertBody({ code: 'BAD_REQUEST', message: 'Email already in use', status: 409 });

  })
    .setup(async () => {
      await Database.beginGlobalTransaction()
    })

    .teardown(async () => {
      await Database.rollbackGlobalTransaction()
    })
})
