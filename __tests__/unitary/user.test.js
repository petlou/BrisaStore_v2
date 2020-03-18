import bcrypt from 'bcryptjs';

import factory from '../factories';
import truncate from '../utils/truncate';
import User from '../../src/app/models/User';

describe('User', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should encrypt user password', async () => {
    const data = await factory.attrs('User', {
      password: '123456',
    });

    const user = await User.create(data);

    const compareHash = await bcrypt.compare('123456', user.password_hash);

    expect(compareHash).toBe(true);
  });
});
