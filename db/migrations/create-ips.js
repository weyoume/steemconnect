module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('ips', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
		},
		//client_id: DataTypes.STRING,
    ip: Sequelize.STRING,
		uses: Sequelize.ARRAY(Sequelize.STRING), // ONLY IP USES ARE STORED AND NOT ASSOSCIATED USERNAMES AND ETC..
		created_at: {
      allowNull: false,
      type: Sequelize.DATE,
		},
		updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  })
    .then(() => {
      queryInterface.addIndex('ips', { fields: ['ip'], unique: true });
    }),
  down: (queryInterface) => {
    queryInterface.dropTable('ips');
  },
};
