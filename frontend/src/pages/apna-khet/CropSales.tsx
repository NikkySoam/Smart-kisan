import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import { FaArrowLeft, FaPlus, FaTrash, FaEdit, FaChartLine } from "react-icons/fa";

interface Receipt {
  _id: string;
  buyerName: string;
  date: string;
  quantity: number;
  pricePerQuintal: number;
  totalAmount: number;
  notes: string;
}

const CropSales = () => {
  const { fieldId } = useParams<{ fieldId: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [totalSelling, setTotalSelling] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [field, setField] = useState<any>(null); // To fetch crop selling price if needed

  // Form
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState("");
  const [formData, setFormData] = useState({
    buyerName: "",
    date: new Date().toISOString().substring(0, 10),
    quantity: "",
    notes: ""
  });

  const fetchData = async () => {
    try {
      // Fetch field to get crop name and selling price
      const fieldRes = await API.get(`/fields/${fieldId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (fieldRes.data.success) {
        setField(fieldRes.data.field);
      }

      // Fetch receipts
      const res = await API.get(`/crop-sales/${fieldId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setReceipts(res.data.data.receipts);
        setTotalSelling(res.data.data.totalSelling);
        setTotalQuantity(res.data.data.totalQuantity);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch crop sales data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fieldId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!field?.cropSellingPrice || field.cropSellingPrice <= 0) {
      toast.error("Please set the crop selling price on the field first.");
      return;
    }
    
    try {
      if (editId) {
        const res = await API.put(`/crop-sales/${editId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          toast.success("Receipt updated");
        }
      } else {
        const res = await API.post(`/crop-sales/${fieldId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          toast.success("Receipt added");
        }
      }
      setShowModal(false);
      setEditId("");
      fetchData();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save receipt");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this receipt?")) return;
    try {
      const res = await API.delete(`/crop-sales/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        toast.success("Receipt deleted");
        fetchData();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete receipt");
    }
  };

  const openEdit = (r: Receipt) => {
    setFormData({
      buyerName: r.buyerName,
      date: new Date(r.date).toISOString().substring(0, 10),
      quantity: r.quantity.toString(),
      notes: r.notes
    });
    setEditId(r._id);
    setShowModal(true);
  };

  const openNew = () => {
    setFormData({
      buyerName: "",
      date: new Date().toISOString().substring(0, 10),
      quantity: "",
      notes: ""
    });
    setEditId("");
    setShowModal(true);
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading sales data...</div>;
  }

  return (
    <div className="py-2 px-4 sm:p-4 max-w-3xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/fields")}
            className="p-3 bg-white text-green-700 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <FaArrowLeft />
          </button>
          <div>
            <h1 className="text-2xl font-bold bg-linear-to-r from-green-500 to-green-800 bg-clip-text text-transparent">
              Crop Sales
            </h1>
            <p className="text-gray-500">{field?.name} - {field?.crop}</p>
          </div>
        </div>
        <button
          onClick={openNew}
          className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg transition-all cursor-pointer"
        >
          <FaPlus />
        </button>
      </div>

      {/* Warning if no crop price set */}
      {(!field?.cropSellingPrice || field.cropSellingPrice <= 0) && (
        <div className="bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-2xl mb-6 shadow-sm">
          <strong>Notice:</strong> You haven't set a selling price for {field?.crop}. Please go back to the fields dashboard and set it before adding receipts.
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
            <FaChartLine className="text-6xl text-green-900" />
          </div>
          <p className="text-sm font-semibold text-gray-500 mb-1 z-10">Total Quantity Sold</p>
          <h2 className="text-3xl font-bold text-gray-800 z-10">{totalQuantity} <span className="text-lg font-medium text-gray-500">Q</span></h2>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-4 rounded-3xl shadow-sm border border-emerald-200 flex flex-col items-center justify-center">
          <p className="text-sm font-semibold text-emerald-800 mb-1">Total Sales Amount</p>
          <h2 className="text-3xl font-bold text-emerald-900">₹{totalSelling.toLocaleString()}</h2>
        </div>
      </div>

      {/* Receipts List */}
      <h3 className="font-bold text-gray-700 mb-3 px-1">Sales History (Receipts)</h3>
      {receipts.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl shadow-sm text-center text-gray-500 border border-gray-100">
          No receipts added yet. Click the + button to add one.
        </div>
      ) : (
        <div className="space-y-4">
          {receipts.map(r => (
            <div key={r._id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-gray-800 text-sm truncate">{r.buyerName}</h4>
                <p className="font-bold text-green-700 whitespace-nowrap">₹{r.totalAmount.toLocaleString()}</p>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <div className="flex gap-2 items-center truncate">
                  <span>{new Date(r.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}</span>
                  <span className="text-gray-300">•</span>
                  <span>{r.quantity}Q × ₹{r.pricePerQuintal}</span>
                  {r.notes && (
                    <>
                      <span className="text-gray-300">•</span>
                      <span className="truncate max-w-[80px] sm:max-w-none">{r.notes}</span>
                    </>
                  )}
                </div>
                <div className="flex gap-3 shrink-0 ml-2">
                  <button onClick={() => openEdit(r)} className="text-blue-500 hover:text-blue-700 cursor-pointer">
                    <FaEdit size={14} />
                  </button>
                  <button onClick={() => handleDelete(r._id)} className="text-red-500 hover:text-red-700 cursor-pointer">
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="bg-green-600 p-4 text-white flex justify-between items-center">
              <h2 className="font-bold text-lg">{editId ? "Edit Receipt" : "Add Sale Receipt"}</h2>
              <button onClick={() => setShowModal(false)} className="text-white hover:text-green-200 cursor-pointer text-xl">&times;</button>
            </div>
            
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.buyerName}
                  onChange={e => setFormData({...formData, buyerName: e.target.value})}
                  placeholder="e.g. Ravish or RajSingh"
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-2xl outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-2xl outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Quantity (Quintal)</label>
                <input
                  type="number"
                  required
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: e.target.value})}
                  placeholder="e.g. 45"
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-2xl outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Notes (Optional)</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  placeholder="Any details..."
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-2xl outline-none focus:border-green-500"
                />
              </div>
              
              {formData.quantity && field?.cropSellingPrice && (
                <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-800 text-sm font-medium border border-emerald-100 flex justify-between">
                  <span>Calculated Total:</span>
                  <span className="font-bold">₹{(Number(formData.quantity) * field.cropSellingPrice).toLocaleString()}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold p-4 rounded-2xl transition-all shadow-md mt-4 cursor-pointer"
              >
                Save Receipt
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CropSales;
