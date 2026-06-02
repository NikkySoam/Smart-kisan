import jsPDF from "jspdf";

import autoTable from "jspdf-autotable";

interface Entry {
  date: string;

  hours: number;

  totalAmount: number;
}

interface FarmerBillData {
  farmerName: string;

  entries: Entry[];

  totalHours: number;

  totalAmount: number;

  waterRate: number;
}

const generateBill = ({
  farmerName,
  entries,
  totalHours,
  totalAmount,
  waterRate,
}: FarmerBillData) => {
  const doc = new jsPDF();

  // TITLE

  doc.setFontSize(22);

  doc.text(
    "Smart Kisan Water Bill",
    14,
    20
  );

  // FARMER INFO

  doc.setFontSize(14);

  doc.text(
    `Farmer Name: ${farmerName}`,
    14,
    40
  );

  doc.text(
    `Water Rate: ₹${waterRate}/hour`,
    14,
    50
  );

  doc.text(
    `Total Hours: ${totalHours}`,
    14,
    60
  );

  doc.text(
    `Total Amount: ₹${totalAmount}`,
    14,
    70
  );

  // TABLE

  autoTable(doc, {
    startY: 85,

    head: [
      [
        "Date",
        "Hours",
        "Amount",
      ],
    ],

    body: entries.map(
      (entry) => [
        new Date(
          entry.date
        ).toLocaleDateString(),

        entry.hours,

        `₹${entry.totalAmount}`,
      ]
    ),
  });

  // SAVE PDF

  doc.save(
    `${farmerName}-bill.pdf`
  );
};

export default generateBill;