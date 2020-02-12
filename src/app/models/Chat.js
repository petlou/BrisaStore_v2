import Sequelize, { Model } from 'sequelize';

class Chat extends Model {
  static init(sequelize) {
    super.init({
      chat_id: Sequelize.INTEGER,
      user_id: Sequelize.INTEGER,
      provider_id: Sequelize.INTEGER,
    },
    {
      sequelize
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default Chat;