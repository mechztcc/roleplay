import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';

export default class UsersController {
  public async store({ response, request }: HttpContextContract) {
    const payload = request.only(['email', 'username', 'password', 'avatar']);
    
		const user = await User.create(payload);
		return response.status(201).send(user);
  }
}
