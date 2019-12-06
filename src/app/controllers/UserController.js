import User from '../models/User';

class UserController {
  async store(req, res) {
    const userExixt = await User.findOne({ where: { email: req.body.email } });

    if (userExixt) {
      return res.status(400).json({ error: 'User alredy exists.' });
    }

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    return res.json({ res: 'true' });
  }
}

export default new UserController();
