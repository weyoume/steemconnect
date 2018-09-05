'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('apps', [
      {
        client_id: 'test.WeYouMe.app',
        secret: '5KRteSXcJfVk6hpkqgNQtZL3ea9yWDQnqERXWJQF1CEaLSjqR9n',
        owner: 'test.WeYouMe',
        redirect_uris: JSON.stringify(['http://localhost:5555/demo', 'http://localhost:5555', 'https://auth.weyoume.io/demo', 'https://alpha.weyoume.io/callback']),
        name: 'alpha.weyoume.io',
        description: 'Ensuring non-brutal life',
        icon: 'https://byteball.co/img/logo.jpg',
        website: 'https://alpha.weyoume.io',
        beneficiaries: JSON.stringify([{ account: 'test.WeYouMe', weight: 1500 }]),
        is_approved: true,
        is_public: true,
        is_disabled: false,
        allowed_ips: JSON.stringify(['127.0.0.1', '::1']),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        client_id: 'simple-app',
        secret: 'secretkey-abc-456',
        owner: 'val',
        redirect_uris: JSON.stringify(['http://localhost:5555/demo', 'http://localhost:5555', 'https://sc2-angular.herokuapp.com', 'https://auth.weyoume.io/demo', 'https://alpha.weyoume.io/callback']),
        name: 'Simple App',
        description: 'This is a test app.',
        icon: 'https://byteball.co/img/logo.jpg',
        website: 'https://example.com',
        beneficiaries: JSON.stringify([]),
        allowed_ips: JSON.stringify(['127.0.0.1', '::1']),
        is_approved: true,
        is_public: true,
        is_disabled: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('apps', null, {});
  },
};
