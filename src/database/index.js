import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';

import User from '../app/models/User';
import Product from '../app/models/Product';
import File from '../app/models/File';

import databaseConfig from '../config/database';

const models = [User, Product, File];

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
    let MONGO_URL;
    if (process.env.NODE_ENV !== 'test') {
      MONGO_URL = `mongodb://localhost:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;

      this.mongoConnection = mongoose.connect(MONGO_URL, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      });

      console.log(`${MONGO_URL}`);
    } else {
      MONGO_URL = process.env.MONGO_URL;
      MongoClient.connect(MONGO_URL, {
        useUnifiedTopology: true,
      });
      console.log(`${MONGO_URL}`);
    }
  }
}

export default new Database();
