module.exports = (sequelize, DataTypes) => sequelize.define('ips',
  {
		//client_id: DataTypes.STRING,
    ip: DataTypes.STRING,
		uses: DataTypes.ARRAY(DataTypes.STRING),  // ONLY IP USES ARE STORED AND NOT ASSOSCIATED USERNAMES AND ETC..
		created_at: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
		},
		updated_at: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
  },
  {
    freezeTableName: true,
    underscored: true,
    indexes: [
        { unique: true, fields: ['ip'] }
    ],
  });
