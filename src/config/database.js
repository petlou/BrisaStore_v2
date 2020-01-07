module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'postgres',
  database: 'BrisaStore',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true
  }
};