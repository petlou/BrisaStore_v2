import Sequelize, { Model } from 'Sequelize';

class Product extends Model {
  static init(sequelize) {
    super.init({
      modelo: Sequelize.STRING,
      descricao: Sequelize.STRING,
      quantidade: Sequelize.INTEGER,
      preco: Sequelize.DOUBLE,
      imagem_url: Sequelize.STRING
    },
    {
      sequelize
    });

    return this;
  }
}

export default Product;