import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const htmlRoutes = express.Router();

htmlRoutes.get("/paypal/return-url", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../public/views/PaypalReturn.view.html")
  );
});

htmlRoutes.get("/paypal/cencel", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../../public/views/PaypalCancel.view.html")
  );
});
