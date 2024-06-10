import express, {Express}  from "express";
import mongoose from "mongoose";
import financialRecordRouter from "./routes/financial-records";
import cors from "cors";

// creating some typescript types
const app:Express = express();
const port = process.env.PORT || 3001;

//middleware for all our endpoints to basically allow json in to the bodies of each request
app.use(express.json());
app.use(cors());

// setting up MongoDB connnection
const mongoURI: string = "mongodb://127.0.0.1:27017/FinanceTrackerManager";

mongoose
.connect(mongoURI)
.then(()=> console.log("Connected to MongoDB!"))
.catch((err)=> console.log("Failed to connect to MongoDB: ",err));

app.use("/financial-records", financialRecordRouter);

app.listen(port, ()=> {
  console.log(`Server is running on port ${port}`);
})