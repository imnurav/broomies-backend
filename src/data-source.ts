import { User } from "./entities/User";
import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "mysql", // Using MySQL
  host: "localhost", // MySQL host
  port: 3306, // Default MySQL port
  username: "root", // MySQL username
  password: "", // MySQL password
  database: "broomies", // Database name
  synchronize: false, // Disable auto synchronization in production (use migrations instead)
  logging: true,
  entities: [User], // List your entities here
  migrations: ["src/migrations/*.ts"], // Path to migration files
  subscribers: [],
});
