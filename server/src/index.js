import dotenv from "dotenv";
dotenv.config();
import app from "./app.js"
import { connectdb } from "./configs/db.config.js";
const PORT = process.env.PORT || 8000;

connectdb().then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.error("Failed to connect to MongoDB", err);
});