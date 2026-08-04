import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface FieldInsightsData {
  overview: { totalFields: number; totalRevenue: number; totalExpenses: number; netProfit: number };
  bestField: { name: string; crop: string; netProfit: number } | null;
  leaderboard: { name: string; crop: string; netProfit: number; profitPerArea: number }[];
  expenses: { water: number; fertilizer: number; labour: number; equipment: number };
  cropStats: Record<string, { count: number; revenue: number; expenses: number; profit: number }>;
  recommendations?: string[];
}

export const generateFieldInsightsPDF = (data: FieldInsightsData) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(22);
  doc.setTextColor(34, 139, 34); // Forest Green
  doc.text("Field Performance Insights", 14, 20);
  
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleDateString("en-IN")}`, 14, 28);
  
  // Farm Overview
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text("Farm Overview", 14, 40);
  
  const overviewBody = [
    ["Total Fields", data.overview.totalFields.toString()],
    ["Total Revenue", `Rs. ${data.overview.totalRevenue.toLocaleString()}`],
    ["Total Expenses", `Rs. ${data.overview.totalExpenses.toLocaleString()}`],
    ["Net Profit", `Rs. ${data.overview.netProfit.toLocaleString()}`],
  ];
  
  autoTable(doc, {
    startY: 45,
    body: overviewBody,
    theme: 'grid',
    styles: { fontSize: 11 },
    columnStyles: { 0: { fontStyle: 'bold', fillColor: [240, 248, 240] } }
  });
  
  let currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  
  // Best & Lowest Performers
  if (data.bestField) {
    doc.setFontSize(14);
    doc.text("Best Performing Field", 14, currentY);
    autoTable(doc, {
      startY: currentY + 5,
      body: [
        ["Field", data.bestField.name],
        ["Crop", data.bestField.crop],
        ["Profit", `Rs. ${data.bestField.netProfit.toLocaleString()}`]
      ],
      theme: 'grid',
      styles: { fontSize: 10 }
    });
    currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  }
  
  // Leaderboard
  doc.setFontSize(14);
  doc.text("Field Performance Leaderboard", 14, currentY);
  
  const leaderboardBody = data.leaderboard.map((field, index: number) => [
    `#${index + 1}`,
    field.name,
    field.crop,
    `Rs. ${field.netProfit.toLocaleString()}`,
    `Rs. ${field.profitPerArea.toLocaleString(undefined, {maximumFractionDigits: 2})}`
  ]);
  
  autoTable(doc, {
    startY: currentY + 5,
    head: [["Rank", "Field", "Crop", "Net Profit", "Profit/Area"]],
    body: leaderboardBody,
    theme: 'striped',
    headStyles: { fillColor: [34, 139, 34] }
  });
  
  currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  
  // Expense Breakdown
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }
  
  doc.setFontSize(14);
  doc.text("Expense Breakdown", 14, currentY);
  autoTable(doc, {
    startY: currentY + 5,
    head: [["Category", "Amount (Rs.)"]],
    body: [
      ["Water", data.expenses.water.toLocaleString()],
      ["Fertilizer", data.expenses.fertilizer.toLocaleString()],
      ["Labour", data.expenses.labour.toLocaleString()],
      ["Equipment", data.expenses.equipment.toLocaleString()],
    ],
    theme: 'grid'
  });
  currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  // Crop Profitability
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }
  
  doc.setFontSize(14);
  doc.text("Crop Profitability", 14, currentY);
  
  const cropBody = Object.entries(data.cropStats).map(([crop, stats]) => [
    crop,
    stats.count.toString(),
    `Rs. ${stats.revenue.toLocaleString()}`,
    `Rs. ${stats.expenses.toLocaleString()}`,
    `Rs. ${stats.profit.toLocaleString()}`
  ]);
  
  autoTable(doc, {
    startY: currentY + 5,
    head: [["Crop", "Fields", "Revenue", "Expenses", "Net Profit"]],
    body: cropBody,
    theme: 'striped',
    headStyles: { fillColor: [46, 139, 87] }
  });
  
  currentY = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
  
  // Recommendations
  if (data.recommendations && data.recommendations.length > 0) {
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(14);
    doc.text("Smart Farm Recommendations", 14, currentY);
    
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    let recY = currentY + 10;
    
    data.recommendations.forEach((rec: string) => {
      const splitText = doc.splitTextToSize(`• ${rec}`, 180);
      doc.text(splitText, 14, recY);
      recY += splitText.length * 6 + 2;
    });
  }

  // Save/Preview
  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  const previewWindow = window.open(pdfUrl, "_blank");

  if (!previewWindow) {
    alert("Please allow popups to preview the PDF report.");
  }

  setTimeout(() => {
    URL.revokeObjectURL(pdfUrl);
  }, 10000);
};
