const bcrypt = require('bcryptjs');

module.exports = {
  up: (queryInterface) => {

      return queryInterface.bulkInsert('users', [{
        name: 'Peter Lourenço',
        email: 'peter@peter.com',
        password_hash: bcrypt.hashSync('123456', 8),
        provider: true,
        created_at: new Date(),
        updated_at: new Date()
      }], {});
  },

  down: () => {}
};
