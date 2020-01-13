import Sequelize, { Model } from 'sequelize';

class Product extends Model {
  static init(sequelize) {
    super.init({
      modelo: Sequelize.STRING,
      descricao: Sequelize.STRING,
      quantidade: Sequelize.INTEGER,
      preco: Sequelize.DOUBLE,
    },
    {
      sequelize
    });

    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, { foreignKey: 'imagem_id', as: 'imagem' });
  }
}

export default Product;