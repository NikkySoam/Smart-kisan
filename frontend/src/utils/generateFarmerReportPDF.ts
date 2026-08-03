import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface DetailedWaterEntry {
  date: string;
  hours: number;
  totalAmount: number;
  waterRate?: number;
  notes?: string;
}

export interface FarmerReportData {
  farmer: {
    _id: string;
    name: string;
    phone?: string;
  };
  totalHours: number;
  totalAmount: number;
  totalEntries: number;
  entries: DetailedWaterEntry[];
}

const generateFarmerReportPDF = (data: FarmerReportData) => {
  const doc = new jsPDF();

  // Header Title
  doc.setFontSize(22);
  doc.setTextColor(6, 78, 59); // emerald-900
  doc.text("Smart Kisan", 14, 20);

  doc.setFontSize(16);
  doc.setTextColor(4, 120, 87); // emerald-700
  doc.text("Water Usage Report", 14, 28);

  // Farmer Details
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(`Farmer Name: ${data.farmer.name}`, 14, 40);
  if (data.farmer.phone) {
    doc.text(`Phone Number: ${data.farmer.phone}`, 14, 47);
  }
  doc.text(
    `Generated Date: ${new Date().toLocaleDateString("en-IN")}`,
    14,
    data.farmer.phone ? 54 : 47
  );

  // Summary Section
  const startY = data.farmer.phone ? 64 : 57;
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Summary", 14, startY);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(`Total Hours: ${data.totalHours.toFixed(1)} h`, 14, startY + 7);
  doc.text(`Total Cost: Rs ${data.totalAmount.toFixed(2)}`, 70, startY + 7);
  doc.text(`Total Entries: ${data.totalEntries}`, 140, startY + 7);

  // Entries Table
  autoTable(doc, {
    startY: startY + 15,
    head: [["Date", "Hours", "Water Rate", "Cost", "Notes"]],
    body: data.entries.map((entry) => [
      new Date(entry.date).toLocaleDateString("en-IN"),
      entry.hours.toString(),
      entry.waterRate ? `Rs ${entry.waterRate}` : "-",
      `Rs ${entry.totalAmount.toFixed(2)}`,
      entry.notes || "-",
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
    },
  });

  // Footer Totals
  // @ts-ignore
  const finalY = doc.lastAutoTable.finalY + 10;
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Final Total Hours: ${data.totalHours.toFixed(1)} h`, 14, finalY);
  doc.text(`Final Total Cost: Rs ${data.totalAmount.toFixed(2)}`, 14, finalY + 7);

  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
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

export default generateFarmerReportPDF;
