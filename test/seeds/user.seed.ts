import { DataSource } from 'typeorm';

export const userSeed = async (dataSource: DataSource) => {
  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.connect();

  await queryRunner.query(`
      INSERT INTO users (id, email, password, created_at, updated_at)
      VALUES ('1', '
    `);
};
