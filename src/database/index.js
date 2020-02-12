import Sequelize from 'sequelize';
import mongoose from 'mongoose';

import User from '../app/models/User';
import Product from '../app/models/Product';
import File from '../app/models/File';
import Chat from '../app/models/Chat';

import databaseConfig from '../config/database';

const models = [User, Product, File, Chat];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      process.env.MONGO_URL,
      {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true
      }
    );
  }
}

export default new Database();