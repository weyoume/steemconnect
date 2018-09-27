'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('tokens', [
      {
        client_id: 'webuilder',
        user: 'webuilder',
        token: '2973tyfu32bfp923f239fgp9237gf23f',
        created_at: new Date(),
        updated_at: new Date(),
      }
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('tokens', null, {});
  }
};
