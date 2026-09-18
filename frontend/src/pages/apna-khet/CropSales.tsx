import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { queryClient } from "../../api/queryClient";
import { useCropSales } from "../../hooks/queries/useCropSalesQuery";
import { useFieldDetails } from "../../hooks/queries/useFieldQuery";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import { FaArrowLeft, FaPlus, FaTrash, FaEdit, FaChartLine } from "react-icons/fa";

interface Field {
  _id: string;
  name: string;
  area: number;
  location: string;
  crop: string;
  cropSellingPrice?: number;
}

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
  const { t } = useTranslation();
  const { fieldId } = useParams<{ fieldId: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { data: salesData, isLoading: loadingSales } = useCropSales(fieldId);
  const { data: fieldDetails } = useFieldDetails(fieldId);

  const receipts = salesData?.receipts || [];
  const totalSelling = salesData?.totalSelling || 0;
  const totalQuantity = salesData?.totalQuantity || 0;
  const field = (fieldDetails?.field as Field | undefined) || null;
  const loading = loadingSales;

  // Form
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState("");
  const [formData, setFormData] = useState({
    buyerName: "",
    date: new Date().toISOString().substring(0, 10),
    quantity: "",
    cropSellingPrice: "",
    notes: ""
  });

  // React Query handles fetching automatically

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!field) return;

    const quantity = Number(formData.quantity);
    const cropSellingPrice = Number(formData.cropSellingPrice);

    if (!formData.cropSellingPrice || cropSellingPrice <= 0) {
      toast.error(t("invalidCropPrice") || "Enter a valid crop price");
      return;
    }

    if (!quantity || quantity <= 0) {
      toast.error(t("invalidQuantity") || "Enter a valid quantity");
      return;
    }

    try {
      const payload = {
        ...formData,
        quantity: quantity.toString(),
        cropSellingPrice: cropSellingPrice.toString(),
      };

      if (editId) {
        const res = await API.put(`/crop-sales/${editId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          toast.success(t("receiptUpdated"));
        }
      } else {
        const res = await API.post(`/crop-sales/${fieldId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          toast.success(t("receiptAdded"));
        }
      }
      setShowModal(false);
      setEditId("");
      setFormData({
        buyerName: "",
        date: new Date().toISOString().substring(0, 10),
        quantity: "",
        cropSellingPrice: "",
        notes: ""
      });
      queryClient.invalidateQueries({ queryKey: ['cropSales', fieldId] });
      queryClient.invalidateQueries({ queryKey: ['fieldsWithAnalytics'] });
      queryClient.invalidateQueries({ queryKey: ['fieldInsights'] });
    } catch (error) {
      console.error(error);
      toast.error(t("failedToSaveReceipt"));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t("deleteReceiptConfirm"))) return;
    try {
      const res = await API.delete(`/crop-sales/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        toast.success(t("receiptDeleted"));
        queryClient.invalidateQueries({ queryKey: ['cropSales', fieldId] });
        queryClient.invalidateQueries({ queryKey: ['fieldsWithAnalytics'] });
        queryClient.invalidateQueries({ queryKey: ['fieldInsights'] });
      }
    } catch (error) {
      console.error(error);
      toast.error(t("failedToDeleteReceipt"));
    }
  };

  const openEdit = (r: Receipt) => {
    setFormData({
      buyerName: r.buyerName,
      date: new Date(r.date).toISOString().substring(0, 10),
      quantity: r.quantity.toString(),
      cropSellingPrice: r.pricePerQuintal.toString(),
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
      cropSellingPrice: "",
      notes: ""
    });
    setEditId("");
    setShowModal(true);
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">{t("loadingSalesData")}</div>;
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
              {t("cropSales")}
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

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
            <FaChartLine className="text-6xl text-green-900" />
          </div>
          <p className="text-sm font-semibold text-gray-500 mb-1 z-10">{t("totalQuantitySold")}</p>
          <h2 className="text-3xl font-bold text-gray-800 z-10">{totalQuantity} <span className="text-lg font-medium text-gray-500">Q</span></h2>
        </div>
        <div className="bg-linear-to-br from-green-50 to-emerald-100 p-4 rounded-3xl shadow-sm border border-emerald-200 flex flex-col items-center justify-center">
          <p className="text-sm font-semibold text-emerald-800 mb-1">{t("totalSalesAmount")}</p>
          <h2 className="text-3xl font-bold text-emerald-900">₹{totalSelling.toLocaleString()}</h2>
        </div>
      </div>

      {/* Receipts List */}
      <h3 className="font-bold text-gray-700 mb-3 px-1">{t("salesHistory")}</h3>
      {receipts.length === 0 ? (
        <div className="bg-white p-8 rounded-3xl shadow-sm text-center text-gray-500 border border-gray-100">
          {t("noReceiptsAdded")}
        </div>
      ) : (
        <div className="space-y-4">
          {receipts.map((r: Receipt) => (
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
                      <span className="truncate max-w-20 sm:max-w-none">{r.notes}</span>
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
              <h2 className="font-bold text-lg">{editId ? t("editReceipt") : t("addSaleReceipt")}</h2>
              <button onClick={() => setShowModal(false)} className="text-white hover:text-green-200 cursor-pointer text-xl">&times;</button>
            </div>
            
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t("buyerName")}</label>
                <input
                  type="text"
                  required
                  value={formData.buyerName}
                  onChange={e => setFormData({...formData, buyerName: e.target.value})}
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-2xl outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t("quantityQuintals")}</label>
                <input
                  type="number"
                  required
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: e.target.value})}
                  placeholder={t("quantityPlaceholder")}
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-2xl outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {t("cropSellingPrice") || "Crop Selling Price"}
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.cropSellingPrice}
                  onChange={e => setFormData({...formData, cropSellingPrice: e.target.value})}
                  placeholder={t("enterCropPrice") || "Enter price per quintal"}
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-2xl outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{t("notesOptional")}</label>
                <input
                  type="text"
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  placeholder={t("notesPlaceholder")}
                  className="w-full bg-gray-50 border border-gray-200 p-3 rounded-2xl outline-none focus:border-green-500"
                />
              </div>
              
              {formData.quantity && (Number(formData.quantity) > 0) && Number(formData.cropSellingPrice) > 0 && (
                <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-800 text-sm font-medium border border-emerald-100 flex justify-between">
                  <span>{t("calculatedTotal") || "Calculated Total:"}</span>
                  <span className="font-bold">₹{(Number(formData.quantity) * Number(formData.cropSellingPrice)).toLocaleString()}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold p-4 rounded-2xl transition-all shadow-md mt-4 cursor-pointer"
              >
                {t("save")}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default CropSales;
