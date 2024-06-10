import express, {Request, Response} from 'express';
import FinancialRecordModel from '../schema/financial-record';

const router = express.Router();

// GET /financial-records endpoint, for getting all financial records for a user
router.get("/getAllByUserID/:userId", async(req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const records = await FinancialRecordModel.find({userId: userId});

    // If records is empty, return a 404 status code
    if(records.length === 0) {
      return res.status(404).send("No records found for the user");
    }
    res.status(200).send(records);
  } catch (error) {
    res.status(500).send(error);
  }
});

// POST /financial-records endpoint, for creating a new financial record
router.post("/", async (req: Request, res: Response) => {
  try {
    const newRecordBody = req.body;
    console.log("Received new record body:", newRecordBody); // Log the incoming request body

    const newRecord = new FinancialRecordModel(newRecordBody);
    const savedRecord = await newRecord.save();
    res.status(200).send(savedRecord);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error adding financial record:", error.message);
      res.status(500).send({ message: "Internal Server Error", error: error.message });
    } else {
      console.error("Unknown error:", error);
      res.status(500).send({ message: "Internal Server Error", error: "Unknown error" });
    }
  }
});
// PUT /financial-records/:id endpoint, for updating a financial record
router.put("/:id", async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const newRecordBody = req.body;
    const record = await FinancialRecordModel.findByIdAndUpdate(id, newRecordBody, {new: true});
    
    if (!record) return res.status(404).send("No record found");
    
    res.status(200).send(record);
  } catch (error) {
    res.status(500).send(error);
  }
});

// DELETE /financial-records/:id endpoint, for deleting a financial record
router.delete("/:id", async(req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const record = await FinancialRecordModel.findByIdAndDelete(id);
    if (!record) return res.status(404).send("No record found");
    res.status(200).send(record);
  } catch (error) {
    res.status(500).send(error);
  }
});
export default router;