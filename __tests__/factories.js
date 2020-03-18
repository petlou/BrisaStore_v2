import faker from 'faker';
import { factory } from 'factory-girl';

import User from '../src/app/models/User';
import Product from '../src/app/models/Product';
import Notification from '../src/app/schemas/Notification';

factory.define('User', User, {
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
});

factory.define('Product', Product, {
  modelo: faker.commerce.product(),
  descrição: faker.commerce.productAdjective(),
  quantidade: faker.random.number(),
  preço: faker.commerce.price(),
});

factory.define('Notification', Notification, {
  id: faker.random.number(),
  name: faker.name.firstName(),
  price: faker.commerce.price(),
  date: faker.date.recent(),
});

export default factory;
