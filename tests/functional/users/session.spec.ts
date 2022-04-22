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

  test('Its should return 422 when password has a invalid format', async ({ client, assert }) => {
    const plainPassword = '123'
    const user = await UserFactory.merge({ password: plainPassword }).create()

    const response = await client
      .post('/sessions')
      .json({ email: user.email, password: plainPassword })

    response.assertBodyContains({
      code: 'BAD_REQUEST',
      status: 422,
      message: 'E_VALIDATION_FAILURE: Validation Exception',
    })
  })

  test('Its should return an error if the provided user has not found', async ({
    client,
    assert,
  }) => {
    const plainPassword = '123456'
    const nonexistsUser = 'usernotfound@email.com'
    const user = await UserFactory.merge({ password: plainPassword }).create()

    const response = await client
      .post('/sessions')
      .json({ email: nonexistsUser, password: plainPassword })

    response.assertStatus(400)
    response.assertBodyContains({
      code: 'BAD_REQUEST',
      status: 400,
      message: 'Invalid credentials',
    })
  })

  test('Its should return an api token when create a session', async ({ client, assert }) => {
    const plainPassword = '123456'
    const user = await UserFactory.merge({ password: plainPassword }).create()

    const response = await client
      .post('/sessions')
      .json({ email: user.email, password: plainPassword })

    const body = response.body()

    response.assertStatus(201)
    assert.equal(body.user.id, user.id, 'User undefined')
    assert.isDefined(body.token, 'User token not generated')
  })
})
