import express from "express";
import { ensureDatabaseExists } from "./config/db";
import router from "./routes/user-routes";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());
app.use("/api", router);

(async () => {
  try {
    await ensureDatabaseExists();
    app.listen(3001, () => {
      console.log(`Server is running on port 3001`);
    });
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
})();
