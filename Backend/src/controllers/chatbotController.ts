import { Request, Response } from "express";
import { GoogleGenAI, FunctionDeclaration, Type } from "@google/genai";
import * as data from "../services/farmerDataService";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const MODEL = process.env.GEMINI_CHATBOT_MODEL || "gemini-2.5-flash";

const functions: FunctionDeclaration[] = [
  { name: "list_farmers", description: "List Farmers/Customers belonging to the authenticated user. This domain is only for customers using the tubewell service.", parameters: { type: Type.OBJECT, properties: { search: { type: Type.STRING, description: "Optional farmer/customer name search" } } } },
  { name: "get_farmer_details", description: "Get one Farmer/Customer's profile. Never use this for Fields.", parameters: { type: Type.OBJECT, required: ["farmerId"], properties: { farmerId: { type: Type.STRING } } } },
  { name: "get_farmer_tubewell_water", description: "Get tubewell Water records for a Farmer/Customer. This is the Tubewell Management domain. Never use FieldWater here.", parameters: { type: Type.OBJECT, required: ["farmerId"], properties: { farmerId: { type: Type.STRING }, from: { type: Type.STRING, description: "Optional YYYY-MM-DD" }, to: { type: Type.STRING, description: "Optional YYYY-MM-DD" } } } },
  { name: "list_fields", description: "List Fields belonging directly to the authenticated user. Fields are personal farm-management assets and have NO relationship to Farmers/Customers.", parameters: { type: Type.OBJECT, properties: { search: { type: Type.STRING, description: "Optional field name, crop, or location search" } } } },
  { name: "get_field_details", description: "Get a field owned by the authenticated user. Never resolve a field through a Farmer.", parameters: { type: Type.OBJECT, required: ["fieldId"], properties: { fieldId: { type: Type.STRING } } } },
  { name: "get_field_water", description: "Get Farm Management FieldWater records for a user's field. This is separate from Farmer tubewell Water and must never be combined automatically.", parameters: { type: Type.OBJECT, required: ["fieldId"], properties: { fieldId: { type: Type.STRING }, from: { type: Type.STRING }, to: { type: Type.STRING } } } },
  { name: "get_field_fertilizer", description: "Get fertilizer records for a user's field.", parameters: { type: Type.OBJECT, required: ["fieldId"], properties: { fieldId: { type: Type.STRING }, from: { type: Type.STRING }, to: { type: Type.STRING } } } },
  { name: "get_field_labour", description: "Get labour records for a user's field.", parameters: { type: Type.OBJECT, required: ["fieldId"], properties: { fieldId: { type: Type.STRING }, from: { type: Type.STRING }, to: { type: Type.STRING } } } },
  { name: "get_field_equipment", description: "Get equipment expense records for a user's field.", parameters: { type: Type.OBJECT, required: ["fieldId"], properties: { fieldId: { type: Type.STRING }, from: { type: Type.STRING }, to: { type: Type.STRING } } } },
];

const systemInstruction = `You are the read-only Smart Kisan data assistant.\n\nDATA BOUNDARIES:\n1. The authenticated user is the only data owner you may discuss. The server enforces this ownership.\n2. Farmers/Customers and Fields are completely independent domains. There is NO farmer-field relationship. Never infer, search, or claim that a farmer owns, uses, or is associated with a field.\n3. Farmer/Customer water means Tubewell Management Water records from the Water collection.\n4. Field water means Farm Management FieldWater records from the FieldWater collection. They are different systems. Never merge or add them unless the user explicitly asks to compare them; keep totals labeled separately.\n5. You are read-only. Never claim to have created, edited, deleted, or scheduled anything.\n6. Use tools for database facts. Do not invent names, amounts, dates, IDs, or relationships.\n7. If a requested record is not found within the authenticated user's data, say so. Do not search another user.\n8. If the question is ambiguous between tubewell water and field water, ask a short clarification instead of guessing.\n9. Give concise answers with totals and relevant dates when available.`;

type ToolArgs = Record<string, string | undefined>;
type ChatPart =
  | { text: string }
  | { functionCall: { name: string; args: ToolArgs } }
  | { functionResponse: { name: string; response: { result?: unknown; error?: string } } };

type ChatMessage = { role: "user" | "model"; parts: ChatPart[] };

async function runTool(name: string, args: ToolArgs, userId: string) {
  switch (name) {
    case "list_farmers": return data.listFarmers(userId, args.search ?? "");
    case "get_farmer_details": return data.getFarmerDetails(userId, args.farmerId ?? "");
    case "get_farmer_tubewell_water": return data.getFarmerWaterUsage(userId, args.farmerId ?? "", args.from, args.to);
    case "list_fields": return data.listFields(userId, args.search ?? "");
    case "get_field_details": return data.getFieldDetails(userId, args.fieldId ?? "");
    case "get_field_water": return data.getFieldWaterUsage(userId, args.fieldId ?? "", args.from, args.to);
    case "get_field_fertilizer": return data.getFieldFertilizer(userId, args.fieldId ?? "", args.from, args.to);
    case "get_field_labour": return data.getFieldLabour(userId, args.fieldId ?? "", args.from, args.to);
    case "get_field_equipment": return data.getFieldEquipment(userId, args.fieldId ?? "", args.from, args.to);
    default: throw new Error(`Unsupported chatbot tool: ${name}`);
  }
}

export async function chat(req: Request, res: Response) {
  try {
    if (!process.env.GEMINI_API_KEY) return res.status(500).json({ success: false, message: "GEMINI_API_KEY is not configured" });
    const message = typeof req.body?.message === "string" ? req.body.message.trim() : "";
    if (!message) return res.status(400).json({ success: false, message: "message is required" });

    const userId = req.user._id.toString();
    const contents: ChatMessage[] = [{ role: "user", parts: [{ text: message }] }];

    let response = await ai.models.generateContent({
      model: MODEL,
      contents,
      config: { systemInstruction, tools: [{ functionDeclarations: functions }] },
    });

    // Allow a small bounded number of tool rounds so the endpoint cannot loop indefinitely.
    for (let round = 0; round < 4; round++) {
      const calls = response.functionCalls ?? [];
      if (!calls.length) break;

      const functionResponses: Array<{ name: string; response: { result?: unknown; error?: string } }> = [];
      for (const call of calls) {
        const toolName = call.name ?? "";
        try {
          const callArgs: ToolArgs = (call.args ?? {}) as ToolArgs;
          const result = await runTool(toolName, callArgs, userId);
          functionResponses.push({ name: toolName, response: { result: result ?? null } });
        } catch (error) {
          const msg = error instanceof Error ? error.message : "Tool execution failed";
          functionResponses.push({ name: toolName, response: { error: msg } });
        }
      }

      contents.push({
        role: "model",
        parts: calls.map((c) => ({ functionCall: { name: c.name ?? "", args: (c.args ?? {}) as ToolArgs } })),
      });
      contents.push({ role: "user", parts: functionResponses.map((r) => ({ functionResponse: r })) });

      response = await ai.models.generateContent({
        model: MODEL,
        contents,
        config: { systemInstruction, tools: [{ functionDeclarations: functions }] },
      });
    }

    return res.json({ success: true, answer: response.text ?? "I could not generate an answer from the available data." });
  } catch (error) {
    console.error("Chatbot error:", error);
    return res.status(500).json({ success: false, message: "Chatbot request failed" });
  }
}
