import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'

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
})
