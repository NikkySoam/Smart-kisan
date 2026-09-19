import mongoose from "mongoose";
import Farmer from "../models/Farmer";
import Water from "../models/Water";
import Field from "../models/Field";
import FieldWater from "../models/FieldWater";
import Fertilizer from "../models/Fertilizer";
import Labour from "../models/Labour";
import Equipment from "../models/Equipment";

const toId = (id: string) => {
  if (!mongoose.isValidObjectId(id)) throw new Error("Invalid ID");
  return new mongoose.Types.ObjectId(id);
};

const dateFilter = (from?: string, to?: string) => {
  if (!from && !to) return {};
  const date: Record<string, Date> = {};
  if (from) date.$gte = new Date(from);
  if (to) {
    const end = new Date(to);
    end.setHours(23, 59, 59, 999);
    date.$lte = end;
  }
  return { date };
};

type FarmerQueryFilter = {
  user: mongoose.Types.ObjectId;
  name?: { $regex: string; $options: string };
  $or?: Array<Record<string, { $regex: string; $options: string }>>;
};

type FieldQueryFilter = {
  user: mongoose.Types.ObjectId;
  $or?: Array<Record<string, { $regex: string; $options: string }>>;
};

/**
 * IMPORTANT DATA BOUNDARY
 * Farmers/Customers and Fields are independent domains.
 * There is intentionally NO farmer -> field lookup in this service.
 * Every query is scoped to the authenticated user.
 */

export async function listFarmers(userId: string, search?: string) {
  const filter: FarmerQueryFilter = { user: toId(userId) };
  if (search?.trim()) filter.name = { $regex: search.trim(), $options: "i" };
  return Farmer.find(filter).select("name phone village createdAt").lean();
}

export async function getFarmerDetails(userId: string, farmerId: string) {
  return Farmer.findOne({ _id: toId(farmerId), user: toId(userId) })
    .select("name phone village createdAt")
    .lean();
}

export async function getFarmerWaterUsage(userId: string, farmerId: string, from?: string, to?: string) {
  const owner = toId(userId);
  const farmer = toId(farmerId);
  const records = await Water.find({ farmer, user: owner, ...dateFilter(from, to) })
    .sort({ date: -1 }).select("hours date totalAmount farmer").lean();
  return {
    records,
    totalHours: records.reduce((s, r) => s + r.hours, 0),
    totalAmount: records.reduce((s, r) => s + r.totalAmount, 0),
  };
}

export async function listFields(userId: string, search?: string) {
  const filter: FieldQueryFilter = { user: toId(userId) };
  if (search?.trim()) {
    filter.$or = [
      { name: { $regex: search.trim(), $options: "i" } },
      { crop: { $regex: search.trim(), $options: "i" } },
      { location: { $regex: search.trim(), $options: "i" } },
    ];
  }
  return Field.find(filter)
    .select("name area location crop cropSellingPrice createdAt")
    .lean();
}

export async function getFieldDetails(userId: string, fieldId: string) {
  return Field.findOne({ _id: toId(fieldId), user: toId(userId) })
    .select("name area location crop cropSellingPrice createdAt")
    .lean();
}

async function assertFieldOwner(userId: string, fieldId: string) {
  const field = await Field.findOne({ _id: toId(fieldId), user: toId(userId) })
    .select("_id name area location crop cropSellingPrice").lean();
  if (!field) throw new Error("Field not found for the authenticated user");
  return field;
}

export async function getFieldWaterUsage(userId: string, fieldId: string, from?: string, to?: string) {
  await assertFieldOwner(userId, fieldId);
  const records = await FieldWater.find({ field: toId(fieldId), user: toId(userId), ...dateFilter(from, to) })
    .sort({ date: -1 }).select("hours date field").lean();
  return { records, totalHours: records.reduce((s, r) => s + r.hours, 0) };
}

export async function getFieldFertilizer(userId: string, fieldId: string, from?: string, to?: string) {
  await assertFieldOwner(userId, fieldId);
  const records = await Fertilizer.find({ field: toId(fieldId), user: toId(userId), ...dateFilter(from, to) })
    .sort({ date: -1 }).select("fertilizerName quantity cost date field").lean();
  return { records, totalCost: records.reduce((s, r) => s + r.cost, 0), totalQuantity: records.reduce((s, r) => s + r.quantity, 0) };
}

export async function getFieldLabour(userId: string, fieldId: string, from?: string, to?: string) {
  await assertFieldOwner(userId, fieldId);
  const records = await Labour.find({ field: toId(fieldId), user: toId(userId), ...dateFilter(from, to) })
    .sort({ date: -1 }).select("amount workType date field").lean();
  return { records, totalAmount: records.reduce((s, r) => s + r.amount, 0) };
}

export async function getFieldEquipment(userId: string, fieldId: string, from?: string, to?: string) {
  await assertFieldOwner(userId, fieldId);
  const records = await Equipment.find({ field: toId(fieldId), user: toId(userId), ...dateFilter(from, to) })
    .sort({ date: -1 }).select("equipmentName amount date field").lean();
  return { records, totalAmount: records.reduce((s, r) => s + r.amount, 0) };
}
