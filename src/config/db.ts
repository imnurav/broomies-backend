import { DataSource, QueryRunner } from "typeorm";
import { AppDataSource } from "../data-source";

export const ensureDatabaseExists = async (): Promise<DataSource> => {
  try {
    console.log("Attempting to connect to the database...");
    const connection = await AppDataSource.initialize();
    console.log("✅ Database connected successfully!");
    return connection;
  } catch (error: any) {
    console.error(
      "⚠️ Failed to connect to the database. Reason:",
      error.message
    );

    console.log("🌐 Attempting to create the database...");

    const tempDataSource = new DataSource({
      type: "mysql",
      host: "127.0.0.1",
      port: 3306,
      username: "root",
      password: "",
    });

    try {
      const tempConnection = await tempDataSource.initialize();
      console.log("✅ Connected to MySQL server successfully!");

      const queryRunner: QueryRunner = tempConnection.createQueryRunner();
      const databaseName = "broomies";
      await queryRunner.query(
        `CREATE DATABASE IF NOT EXISTS \`${databaseName}\`;`
      );
      console.log(
        `✅ Database "${databaseName}" created successfully or already exists.`
      );

      await tempConnection.destroy();
      console.log(
        "🔄 Reinitializing the AppDataSource with the newly created database..."
      );

      const connection = await AppDataSource.initialize();
      console.log("✅ Database connection established successfully!");
      return connection;
    } catch (creationError: any) {
      console.error(
        "❌ Failed to create the database. Reason:",
        creationError.message
      );
      throw new Error(
        "Database creation and connection failed. Please check your configuration."
      );
    }
  }
};
