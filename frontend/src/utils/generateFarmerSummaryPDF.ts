import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface FarmerSummary {
  farmer: {
    _id: string;
    name: string;
  };
  totalHours: number;
  totalAmount: number;
  totalEntries: number;
}

const generateFarmerSummaryPDF = (summaries: FarmerSummary[]) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(22);
  doc.text("Smart Kisan - Farmer Water Summary", 14, 20);

  // Subtitle
  doc.setFontSize(12);
  doc.text(
    `Generated on: ${new Date().toLocaleDateString("en-IN")} at ${new Date().toLocaleTimeString("en-IN")}`,
    14,
    30
  );

  // Totals
  const overallTotalHours = summaries.reduce((acc, curr) => acc + curr.totalHours, 0);
  const overallTotalAmount = summaries.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const overallTotalEntries = summaries.reduce((acc, curr) => acc + curr.totalEntries, 0);

  doc.setFontSize(11);
  doc.text(`Total Farmers: ${summaries.length}`, 14, 40);
  doc.text(`Total Entries: ${overallTotalEntries}`, 60, 40);
  doc.text(`Total Hours: ${overallTotalHours.toFixed(2)}h`, 110, 40);
  doc.text(`Total Amount: Rs ${overallTotalAmount.toFixed(2)}`, 160, 40);

  // Table
  autoTable(doc, {
    startY: 45,
    head: [["Farmer Name", "Entries", "Total Hours", "Total Amount"]],
    body: summaries.map((summary) => [
      summary.farmer.name,
      summary.totalEntries.toString(),
      summary.totalHours.toString(),
      `Rs ${summary.totalAmount}`,
    ]),
    theme: "grid",
    styles: {
      fontSize: 10,
    },
    headStyles: {
      fillColor: [16, 185, 129], // emerald-500
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252], // slate-50
    }
  });

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(10);
  doc.text("Generated via Smart Kisan", 14, pageHeight - 10);

  // Preview PDF in new tab
  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);

  const previewWindow = window.open(pdfUrl, "_blank");

  if (!previewWindow) {
    alert("Please allow popups to preview the PDF report.");
  }

  // Cleanup Blob URL after some time
  setTimeout(() => {
    URL.revokeObjectURL(pdfUrl);
  }, 10000);
};

export default generateFarmerSummaryPDF;
