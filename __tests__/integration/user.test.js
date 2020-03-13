import request from 'supertest';
import { MongoClient } from 'mongodb';
import app from '../../src/app';

import factory from '../factories';
import truncate from '../utils/truncate';

describe('User', () => {
  let connection;

  beforeAll(async () => {
    console.log('MONGO_URL', process.env.MONGO_URL);
    connection = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await connection.db();
  });

  afterAll(async () => {
    await connection.close();
  });

  beforeEach(async () => {
    await truncate();
  });

  it('should be able to register', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        name: 'Peter Lourenço',
        email: 'peter@peter.com',
        password: '123456',
      });

    expect(response.body).toHaveProperty('id');
  });

  it('should not be able to register with duplicated email', async () => {
    await request(app)
      .post('/users')
      .send({
        name: 'Peter Lourenço',
        email: 'peter@peter.com',
        password: '123456',
      });

    const response = await request(app)
      .post('/users')
      .send({
        name: 'Peter Lourenço',
        email: 'peter@peter.com',
        password: '123456',
      });

    expect(response.status).toBe(400);
  });

  // it('should insert a doc into collection', async () => {
  //   const users = db.collection('users');

  //   const mockUser = { _id: 'some-user-id', name: 'John' };
  //   await users.insertOne(mockUser);

  //   const insertedUser = await users.findOne({ _id: 'some-user-id' });
  //   expect(insertedUser).toEqual(mockUser);

  //   await users.deleteMany({});
  // });
});
