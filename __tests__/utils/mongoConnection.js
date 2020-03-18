import database from '../../src/database';

export default async function truncate() {
  const connection = await database.mongoConnection();

  return connection;
}
