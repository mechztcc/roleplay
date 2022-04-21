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

  test('Its should return 422 when required data is not provided or invalid', async ({ client, assert }) => {
    const user = await UserFactory.create();

    const response = await client.post('/forgot-password').json({ });

    response.assertBodyContains({ code: 'BAD_REQUEST', message: 'E_VALIDATION_FAILURE: Validation Exception', errors: [] })
    response.assertStatus(422)

  })
})
