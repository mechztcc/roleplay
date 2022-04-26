import { test } from '@japa/runner'
import User from 'App/Models/User'
import { GroupFactory, UserFactory } from 'Database/factories'

test.group('Group request', () => {
  test('It should create a group request', async ({ client, assert }) => {
    const plainPassword = '123456'
    const user = await UserFactory.merge({ password: plainPassword }).create()

    const login = await client
      .post('/sessions')
      .json({ email: user.email, password: plainPassword })

    const body = login.body()
    login.assertStatus(201)

    const master = await UserFactory.create()
    const group = await GroupFactory.merge({ master: master.id }).create()

    const response = await client
      .post(`/groups/${group.id}/requests`)
      .header('Authorization', `Bearer ${body.token.token}`)

    const responseBody = response.body()

    assert.exists(responseBody.id, 'Request id not found')
    assert.exists(responseBody.group_id, 'Group id not found')
    assert.exists(responseBody.user_id, 'User id not found')
    assert.exists(responseBody.status, 'Status not found')
    response.assertStatus(201)
  })

  test('It should return 409 when group request already exists', async ({ client, assert }) => {
    const plainPassword = '123456'
    const user = await UserFactory.merge({ password: plainPassword }).create()

    const login = await client
      .post('/sessions')
      .json({ email: user.email, password: plainPassword })

    const body = login.body()
    login.assertStatus(201)

    const master = await UserFactory.create()
    const group = await GroupFactory.merge({ master: master.id }).create()

    await client
      .post(`/groups/${group.id}/requests`)
      .header('Authorization', `Bearer ${body.token.token}`)

    const response = await client
      .post(`/groups/${group.id}/requests`)
      .header('Authorization', `Bearer ${body.token.token}`)

    response.assertStatus(409)
  })

  test('Its should list group requests by master', async ({ client, assert }) => {
    const plainPassword = '123456'
    const user = await UserFactory.merge({ password: plainPassword }).create()

    const login = await client
      .post('/sessions')
      .json({ email: user.email, password: plainPassword })

    const body = login.body()
    login.assertStatus(201)

    const group = await GroupFactory.merge({ master: user.id }).create()

    await client
      .post(`/groups/${group.id}/requests`)
      .header('Authorization', `Bearer ${body.token.token}`)

    const response = await client.get(`/groups/${group.id}/requests?master=${user.id}`)

    const returno = response.body()
    response.assertBodyContains([
      {
        user_id: user.id,
        status: 'PENDING' || 'ACCEPTED',
        group: {},
        user: {},
      },
    ])

    response.assertStatus(202)
  })
})
