import cors from "cors";
import express from "express";
import orderRouter from "@/routes/orderRouter";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/", orderRouter);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

export default app;
