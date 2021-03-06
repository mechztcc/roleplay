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

    response.assertBody({ code: 'BAD_REQUEST', message: 'Email already in use', status: 409 })
  })

  test('Its should return BAD_REQUEST when username already in use', async ({ client }) => {
    const { username } = await UserFactory.create()

    const response = await client.post('/users').json({
      email: 'novoemail@email.com',
      username,
      password: '123456',
    })

    response.assertBody({ code: 'BAD_REQUEST', message: 'User name already in use', status: 409 })
  })

  test('It should return 422 when required data is not provided', async ({ client }) => {
    const response = await client.post('/users').json({})

    response.assertBodyContains({ code: 'BAD_REQUEST' })
    response.assertStatus(422)
  })

  test('It should return 422 when password has incorrect format', async ({ client }) => {
    const response = await client
      .post('/users')
      .json({ username: 'danixhenian', email: 'alberto@email.com', password: '123' })

    response.assertBodyContains({ code: 'BAD_REQUEST' })
    response.assertStatus(422)
  })

  test('It should return 422 when provided an invalid email', async ({ client }) => {
    const response = await client
      .post('/users')
      .json({ username: 'danixhenian', email: 'albertomail.com', password: '123456' })

    response.assertBodyContains({ code: 'BAD_REQUEST' })
    response.assertStatus(422)
  })

  test('Its should update an user', async ({ client }) => {
    const { id, password } = await UserFactory.create()

    const response = await client
      .put(`/users/${id}`)
      .json({ email: 'email1@email.com', avatar: 'http://images.com/images/2', password })

    response.assertStatus(200)
    response.assertBodyContains({ id })
  })

  test('It should return 422 when try to update a user password with invalid format', async ({
    client,
  }) => {
    const { id, email, avatar } = await UserFactory.create()

    const response = await client.put(`/users/${id}`).json({ email, avatar, password: '6543' })

    response.assertStatus(422)
    response.assertBodyContains({ code: 'BAD_REQUEST' })
  })

  test('It should return 404 when try to update a nonexistent user', async ({ client }) => {
    const { email, avatar } = await UserFactory.create()
    const invalidId = 555

    const response = await client
      .put(`/users/${invalidId}`)
      .json({ email, avatar, password: '654321' })

    response.assertStatus(404)
    response.assertBodyContains({ code: 'BAD_REQUEST', message: 'Resource not found', status: 404 })
  })
})
