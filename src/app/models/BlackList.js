import Sequelize, { Model } from 'Sequelize';

class BlackList extends Model {
  static init(sequelize) {
    super.init({
      auth_token: Sequelize.STRING
    },
    {
      sequelize
    });

    return this;
  }
}

export default BlackList;