import request from 'supertest';
import bcrypt from 'bcryptjs';
// import { MongoClient } from 'mongodb';

import app from '../../../src/app';
import factory from '../../factories';
import truncate from '../../utils/truncate';
// import User from '../../../src/app/models/User';

describe('User.Store', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should be able to register', async () => {
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/users')
      .send(user);
    expect(response.body).toHaveProperty('id');
  });

  it('should encrypt user password when new user created', async () => {
    const user = await factory.create('User', {
      password: '123456',
    });

    const compareHash = await bcrypt.compare('123456', user.password_hash);

    expect(compareHash).toBe(true);
  });

  it('should not be able to register with duplicated email', async () => {
    const user = await factory.attrs('User');

    await request(app)
      .post('/users')
      .send(user);

    const response = await request(app)
      .post('/users')
      .send(user);
    expect(response.status).toBe(400);
  });

  it('should not be possible to register without a valid email', async () => {
    const user = await factory.attrs('User', {
      email: 'peter.com.br',
    });

    const response = await request(app)
      .post('/users')
      .send(user);
    expect(response.status).toBe(400);
  });

  it('should not be possible to register without a valid password', async () => {
    const user = await factory.attrs('User', {
      password: 'abc12',
    });

    const response = await request(app)
      .post('/users')
      .send(user);
    expect(response.status).toBe(400);
  });

  it('should not be possible to register without a name field', async () => {
    const user = await factory.attrs('User', {
      name: null,
    });

    const response = await request(app)
      .post('/users')
      .send(user);
    expect(response.status).toBe(400);
  });

  /* it('should encrypt user password', async () => {
    const data = await factory.attrs('User', {
      password: '123456',
    });

    const user = await User.create(data);

    const compareHash = await bcrypt.compare('123456', user.password_hash);

    expect(compareHash).toBe(true);
  }); */
});

describe('User.Update', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should not be able to change the user if the old password does not match', async () => {
    const { name, email } = await factory.create('User');

    const oldPassword = 'differentPassword';

    // const compareHash = await bcrypt.compare(oldPassword, user.password_hash);

    const response = await request(app)
      .put('users')
      .set('Authorization', ``)
      .send({
        name,
        email,
        oldPassword,
        password: 'somePassword',
        confirmPassword: 'somePassword',
      });

    expect(response.status).toBe(401);
  });
});
