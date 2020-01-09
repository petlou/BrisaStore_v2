module.exports = {
  up: (queryInterface) => {

      return queryInterface.bulkInsert('products', [{
        modelo: 'PUMA',
        descricao: 'Tênis Puma!',
        quantidade: 10,
        preco: 289.9,
        imagem_url: 'https://i.imgur.com/qLh1vIf.png',
        created_at: new Date(),
        updated_at: new Date()
      },
    	{
				modelo: 'NIKE',
        descricao: 'Tênis Nike!',
        quantidade: 10,
        preco: 279.9,
        imagem_url: 'https://i.imgur.com/dDDpdii.png',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        modelo: 'ADIDAS',
        descricao: 'Tênis Adidas!',
        quantidade: 10,
        preco: 259.9,
        imagem_url: 'https://i.imgur.com/YKRrdjT.png',
        created_at: new Date(),
        updated_at: new Date()
      }], {});
  },

  down: () => {}
};
