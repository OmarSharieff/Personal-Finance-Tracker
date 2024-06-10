import { useUser } from "@clerk/clerk-react";
import { createContext, useContext, useEffect, useState } from "react";

export interface FinancialRecord {
  id?: string;
  userId: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
}

interface FinancialRecordsContextType {
  records: FinancialRecord[];
  addRecord: (record: FinancialRecord) => void;
}

export const FinancialRecordsContext = createContext<
  FinancialRecordsContextType | undefined
>(undefined);

export const FinancialRecordsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);

  // Get the user from the context
  const {user} = useUser();

  // Fetch records from the server
  const fetchRecords = async()=> {
    if (!user) return;
    const response = await fetch(`http://localhost:3001/financial-records/getAllByUserID/${user.id}`);

    if (response.ok) {
      const records = await response.json();
      console.log(records); // Log the records
      setRecords(records);
    }
  };
  // Calling fetchRecords function on rendering
  useEffect(()=> {
    fetchRecords();
  }, [user]);

  const addRecord = async (record: FinancialRecord) => {
    console.log("Adding record:", record);  // Log the record data

    try {
      const response = await fetch("http://localhost:3001/financial-records", {
        method: "POST",
        body: JSON.stringify(record),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        console.error("Failed to add a new record:", errorResponse);
        return;
      }

      const newRecord = await response.json();
      setRecords((prev) => [...prev, newRecord]);
    } catch (error) {
      console.error("Failed to add a new record:", error);
    }
  };

  return (
    <FinancialRecordsContext.Provider value={{ records, addRecord }}>
      {children}
    </FinancialRecordsContext.Provider>
  );
};

// Creating a constant hook
export const useFinancialRecords = () => {
  const context = useContext<FinancialRecordsContextType | undefined>(
    FinancialRecordsContext
  );

  if (!context) {
    throw new Error(
      "useFinancialRecords must be used within a FinancialRecordsProvider"
    );
  }

  return context;
};
