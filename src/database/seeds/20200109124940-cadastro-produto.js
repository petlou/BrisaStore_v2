module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'products',
      [
        {
          modelo: 'PUMA',
          descricao: 'Tênis Puma!',
          quantidade: 10,
          preco: 289.9,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          modelo: 'NIKE',
          descricao: 'Tênis Nike!',
          quantidade: 10,
          preco: 279.9,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          modelo: 'ADIDAS',
          descricao: 'Tênis Adidas!',
          quantidade: 10,
          preco: 259.9,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
