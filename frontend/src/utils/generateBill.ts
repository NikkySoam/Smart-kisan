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

  // Title
  doc.setFontSize(22);
  doc.text("Water Bill", 14, 20);

  // Farmer Information
  doc.setFontSize(14);

  doc.text(`Farmer Name: ${farmerName}`, 14, 40);
  doc.text(`Water Rate: ${waterRate}/hour`, 14, 50);
  doc.text(`Total Hours: ${totalHours}`, 14, 60);
  doc.text(`Total Amount: ${totalAmount}`, 14, 70);

  // Table
  autoTable(doc, {
    startY: 85,
    head: [["Date", "Hours", "Amount"]],
    body: entries.map((entry) => [
      new Date(entry.date).toLocaleDateString("en-IN"),
      entry.hours.toString(),
      `${entry.totalAmount}`,
    ]),
    theme: "grid",
    styles: {
      fontSize: 10,
    },
    headStyles: {
      fontStyle: "bold",
    },
  });

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();

  doc.setFontSize(10);
  doc.text(
    `Generated on: ${new Date().toLocaleDateString("en-IN")}`,
    14,
    pageHeight - 10
  );

  // Preview PDF in new tab
  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);

  const previewWindow = window.open(pdfUrl, "_blank");

  if (!previewWindow) {
    alert("Please allow popups to preview the PDF bill.");
  }

  // Cleanup Blob URL after some time
  setTimeout(() => {
    URL.revokeObjectURL(pdfUrl);
  }, 10000);
};

export default generateBill;