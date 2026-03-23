const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Add your Gemini API key here

export async function extractUpiTransactionId(file) {
  if (!GEMINI_API_KEY) {
    throw new Error(
      "Gemini API key is not configured. Please add your API key."
    );
  }

  try {
    const base64Data = await fileToBase64(file);
    const base64Content = base64Data.split(",")[1];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Extract the UPI Transaction ID from this receipt image. Rules:
- Must be NUMERIC ONLY (8-15 digits)
- Reject alphanumeric IDs (like PhonePe/Google Pay internal IDs)
- Look for labels: "UPI transaction ID", "UPI txn ID", "UPI Ref No", "UTR", "Ref No", "Reference No", "Transaction ID", "Txn ID"
- DO NOT return amounts, timestamps, or dates
- Return ONLY the numeric transaction ID, nothing else
- If no valid numeric UPI transaction ID found, return "NOT_FOUND"`,
                },
                {
                  inline_data: {
                    mime_type: file.type,
                    data: base64Content,
                  },
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Gemini API error: ${response.status} - ${
          errorData.error?.message || "Unknown error"
        }`
      );
    }

    const data = await response.json();
    const extractedText =
      data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!extractedText || extractedText === "NOT_FOUND") {
      throw new Error("No valid UPI Transaction ID found in the receipt");
    }

    const transactionId = validateAndExtractNumericId(extractedText);
    console.log("✓ Extracted UPI Transaction ID:", transactionId);

    return transactionId;
  } catch (error) {
    console.error("✗ Error extracting transaction ID:", error);
    throw error;
  }
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

function validateAndExtractNumericId(text) {
  const numericPattern = /\b\d{8,15}\b/g;
  const matches = text.match(numericPattern);

  if (!matches || matches.length === 0) {
    throw new Error("No numeric transaction ID found (8-15 digits)");
  }

  // Filter out numbers that are too small or too large
  const filteredMatches = matches.filter((id) => {
    const num = parseInt(id);
    return num >= 10000000 && num <= 999999999999999;
  });

  if (filteredMatches.length === 0) {
    throw new Error("No valid UPI transaction ID found");
  }

  // Return the first valid match
  return filteredMatches[0];
}
