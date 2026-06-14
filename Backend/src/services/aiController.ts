import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";


const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});


export const detectCropIssue =
  async (
    req: Request,
    res: Response
  ) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Image required",
        });
      }

      const imageBase64 =
        req.file.buffer.toString(
          "base64"
        );

      const response =
        await ai.models.generateContent({
          model:
            "gemini-3-flash-preview",

          contents: [
            {
              text: `
            You are an expert agricultural assistant for Indian farmers.

            Your task is to analyze the uploaded crop image and identify the most likely pest, disease, nutrient deficiency, or crop health issue.

            Priority:

            * Support all crops (wheat, rice, sugarcane, maize, potato, tomato, mustard, vegetables, fruits, etc.).
            * Give special attention to sugarcane diseases and pests because they are commonly encountered by users.
            * For sugarcane, carefully check for Top Borer, Pyrilla (Phoka), Thrips, Ant Attack, Red Rot, Smut, Wilt, and other common issues.

            Instructions:

            1. Identify the crop if possible.
            2. Identify the most likely problem visible in the image.
            3. Respond in simple Hindi that a farmer can easily understand.
            4. Avoid scientific names and complex agricultural terms.
            5. Keep explanations short and practical.
            6. Focus on symptoms, treatment, and prevention.
            7. Do not provide unnecessary technical analysis.
            8. Mention only commonly available pesticides, fungicides, or remedies.
            9. Keep the response concise and farmer-friendly.
            10. Unable to Identify:
            If the image is blurry, dark, or unclear, return:
            {
              "crop": "तस्वीर स्पष्ट नहीं है",
              "problem": "Unable to Identify",
              "symptoms": ["तस्वीर स्पष्ट नहीं है"],
              "medicine": [],
              "advice": ["कृपया साफ और नजदीक से फोटो अपलोड करें"]
            }

            Return JSON only:

            {
            "crop": "",
            "problem": "",
            "symptoms": [
            "",
            "",
            ""
            ],
            "medicine": [
            "",
            ""
            ],
            "advice": [
            "",
            ""
            ]
            }

            Example response:

            {
            "crop": "Sugarcane",
            "problem": "Top Borer",
            "symptoms": [
            "ऊपरी पत्तियां सूख रही हैं",
            "पौधे की बढ़वार रुक रही है",
            "तने में छेद दिखाई दे रहे हैं"
            ],
            "medicine": [
            "Chlorantraniliprole 18.5% SC",
            "Fipronil 0.3% GR"
            ],
            "advice": [
            "प्रभावित पौधों को हटाएं",
            "समय पर दवा का छिड़काव करें"
            ]
            }

            `,
            },

            {
              inlineData: {
                mimeType:
                  req.file.mimetype,
                data: imageBase64,
              },
            },
          ],

          config: {
            responseMimeType: "application/json",
            
        }
        });

      const responseText = response.text ?? "";
      let analysisResult = null;

      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysisResult = JSON.parse(jsonMatch[0]);
        } else if (responseText.trim().length > 0) {
          analysisResult = JSON.parse(responseText);
        }

        console.log("back2",analysisResult)

      } catch (parseError) {
        analysisResult = null;
      }

      res.status(200).json({
        success: true,
        data: analysisResult,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          "AI analysis failed",
      });
    }
  };