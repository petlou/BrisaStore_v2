module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('products', 'imagem_id', {
      type: Sequelize.INTEGER,
      references: { model: 'files', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('products', 'imagem_id');
  },
};
