import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'
import Hash from '@ioc:Adonis/Core/Hash'
import { DateTime, Duration } from 'luxon'

test.group('Users password', () => {
  test('It should send a email with forgot password instructions', async ({ client }) => {
    const user = await UserFactory.create()

    const response = await client.post('/forgot-password').json({
      email: user.email,
      resetPasswordUrl: 'url',
    })

    response.assertStatus(204)
  })

  test('Its should create a reset token', async ({ client, assert }) => {
    const user = await UserFactory.create()

    const response = await client
      .post('/forgot-password')
      .json({ email: user.email, resetPasswordUrl: 'url' })

    const tokens = await user.related('tokens').query()

    assert.isNotEmpty(tokens)
  })

  test('Its should return 422 when required data is not provided or invalid', async ({
    client,
    assert,
  }) => {
    const user = await UserFactory.create()

    const response = await client.post('/forgot-password').json({})

    response.assertBodyContains({
      code: 'BAD_REQUEST',
      message: 'E_VALIDATION_FAILURE: Validation Exception',
      errors: [],
    })
    response.assertStatus(422)
  })

  test('Its should be able to reset password', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const { token } = await user.related('tokens').create({ token: 'token' })

    const response = await client.post('/reset-password').json({ token, password: '1234567' })

    await user.refresh()

    const checkPassword = await Hash.verify(user.password, '1234567')

    assert.isTrue(checkPassword)
    response.assertStatus(204)
  })

  test('Its should return 422 when required data is not provided to reset password', async ({
    client,
    assert,
  }) => {
    const response = await client.post('/reset-password')

    response.assertBodyContains({
      code: 'BAD_REQUEST',
      message: 'E_VALIDATION_FAILURE: Validation Exception',
      errors: [],
    })
  })

  test('Its should return 404 when use the same token twice', async ({ client, assert }) => {
    const user = await UserFactory.create()
    const { token } = await user.related('tokens').create({ token: 'token' })

    const response = await client.post('/reset-password').json({ token, password: '1234567' })

    await user.refresh()
    const checkPassword = await Hash.verify(user.password, '1234567')

    assert.isTrue(checkPassword)
    response.assertStatus(204)

    const tryagain = await client.post('/reset-password').json({ token, password: '1234567' })
    tryagain.assertStatus(404)

    tryagain.assertBodyContains({
      code: 'BAD_REQUEST',
      message: 'Resource not found',
      status: 404,
    })

    test('It cannot reset password when token is expired after two hours', async ({
      client,
      assert,
    }) => {
      const user = await UserFactory.create()

      const date = DateTime.now().minus(Duration.fromISOTime('02:01'))

      const { token } = await user.related('tokens').create({ token: 'token', createdAt: date })

      const response = await client.post('/reset-password').json({ token, password: '1234567' })

      await user.refresh()
      const checkPassword = await Hash.verify(user.password, '1234567')

      assert.isTrue(checkPassword)
      response.assertStatus(410)
    })
  })
})
