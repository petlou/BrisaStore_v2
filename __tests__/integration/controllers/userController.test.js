import request from 'supertest';
import bcrypt from 'bcryptjs';
// import { MongoClient } from 'mongodb';

import app from '../../../src/app';
import factory from '../../factories';
import truncate from '../../utils/truncate';

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

describe('Authentication', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should return jwt token when authenticated', async () => {
    const user = await factory.create('User', {
      password: '123123',
    });

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: '123123',
      });

    expect(response.body).toHaveProperty('token');
  });
});

describe('User.Update', () => {
  beforeEach(async () => {
    await truncate();
  });

  it('should not be possible to authenticate without a token', async () => {
    const user = factory.create('User');

    const response = await request(app)
      .put('/users')
      // .set('Authorization', `Bearer ${token}`)
      .send({
        oldPassword: user.password,
        password: 'newPassword123',
        confirmPassword: 'newPassword123',
      });
    expect(response.status).toBe(401);
  });

  it('should not be possible to authenticate with an invalid token', async () => {
    const user = factory.create('User');

    const token = 'invalidToken';

    const response = await request(app)
      .put('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldPassword: user.password,
        password: 'newPassword123',
        confirmPassword: 'newPassword123',
      });
    expect(response.status).toBe(401);
  });

  /* it('should not be possible to change a password if the password entered does not match', async () => {
    // >>>>> ARRUMAR <<<<< - está passando, mas não validando senha, e sim invalid token
    const user = factory.create('User', {
      password: 'somePassword123',
    });

    const { token } = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: 'somePassword123',
      });

    console.log(`[TOKEN] => ${token}`);
    const oldPassword = 'differentPassword123';

    const response = await request(app)
      .put('/users')
      // .set('Authorization', `Bearer ${token}`)
      .send({
        oldPassword,
        password: 'newPassword123',
        confirmPassword: 'newPassword123',
      });
    expect(response.status).toBe(401);
  }); */

  /* it('should not be able to change the user if the old password does not match', async () => {
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
  }); */
});
