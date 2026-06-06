"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jspdf_1 = __importDefault(require("jspdf"));
const jspdf_autotable_1 = __importDefault(require("jspdf-autotable"));
const generateBill = ({ farmerName, entries, totalHours, totalAmount, waterRate, }) => {
    const doc = new jspdf_1.default();
    // TITLE
    doc.setFontSize(22);
    doc.text("Smart Kisan Water Bill", 14, 20);
    // FARMER INFO
    doc.setFontSize(14);
    doc.text(`Farmer Name: ${farmerName}`, 14, 40);
    doc.text(`Water Rate: ₹${waterRate}/hour`, 14, 50);
    doc.text(`Total Hours: ${totalHours}`, 14, 60);
    doc.text(`Total Amount: ₹${totalAmount}`, 14, 70);
    // TABLE
    (0, jspdf_autotable_1.default)(doc, {
        startY: 85,
        head: [
            [
                "Date",
                "Hours",
                "Amount",
            ],
        ],
        body: entries.map((entry) => [
            new Date(entry.date).toLocaleDateString(),
            entry.hours,
            `₹${entry.totalAmount}`,
        ]),
    });
    // SAVE PDF
    doc.save(`${farmerName}-bill.pdf`);
};
exports.default = generateBill;
