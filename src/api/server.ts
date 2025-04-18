import express from "express";
import cors from "cors";
import transactionRoutes from "../routes/transactions";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/transactions", transactionRoutes);

app.listen(3000, '0.0.0.0', () => {
  console.log('API Server running on http://0.0.0.0:3000');
});
