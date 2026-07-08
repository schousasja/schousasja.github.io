import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Resend } from "resend";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json());

  // Server-Side Editorial Copilot (Gemini-Assisted Danish Press Office)
  app.post("/api/admin/editorial-copilot", async (req, res) => {
    try {
      const { task, preset, text, prompt: userPrompt } = req.body;

      // Lazy check for Gemini Key
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          error: "Editorial Desk AI is deactivated. To proceed, append GEMINI_API_KEY under Settings > Secrets."
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      let systemInstruction = "";
      let modelPrompt = "";

      const styleGuide = {
        tv2: `Univue Consultants ApS Red style:
- High-intensity, urgent, dynamic, short paragraphs (1-3 sentences).
- Headlines must be bold, capitalised, and direct (e.g., "# ENERGIPRISER STIGER NU").
- Use at least one prominent ':::highlight' block with the header format "### NOTAT" or "### ANALYSE REPORT" to summarise facts.
- Use Univue-style short dramatic citations (e.g., "> \"Det her er en katastrofe\" — Erhvervsekonom").
- Tone is active, clear, engaging, and highly accessible to the general public.`,
        dr: `Univue Consultants ApS Teal style:
- Balanced, deeply analytical, elegant, objective, journalistic integrity.
- Headers are sophisticated and in title-case/sentence case (e.g., "# Vejen ud af energikrisen: Nye realkreditbevægelser").
- Paragraphs are highly articulate, professional, and well-reasoned.
- Incorporate elegant citations (e.g., "> \"Den historiske balance mellem udbud og stabil realkredit sikrer statskassen mod markante udsving.\" — Benedikte Thuesen, Cheføkonom").
- Tone is educational, serious, high-brow, and highly factual.`,
        univue: `Univue Advisory Group style:
- Academic, elite macroeconomic, highly professional asset management.
- Headings are structured, institutional, and clinical (e.g., "# FORMUESTREMMENS REALIGNMENT OVER FOR RISK-ADJUSTED CAP").
- Uses clear highlight blocks for institutional disclosures.
- Citation authorship belongs to senior analysts or partners (e.g., "> \"Capital flow structures require absolute regulatory parity prior to commitment.\" — Senior Macro Strategist").
- Tone is elite, global financial, quantitative, and deeply strategic.`
      };

      const presetGuidelines = styleGuide[preset as keyof typeof styleGuide] || styleGuide.tv2;

      if (task === "generate") {
        systemInstruction = `You are a professional editor-in-chief for Univue Publications. 
Your task is to take dry notes, bullet points, or raw descriptions and compile them into a beautifully structured, highly readable article in English.
You must adhere strictly to the requested preset style:
${presetGuidelines}

Output rules for blocks:
1. Headings: Use '#' or '##' (e.g. '# TITLE' or '## Subsection'). Do NOT use '***' or nested lists.
2. Bold statements/Quotes: Use blockquotes for citations. Format exactly as: '> "The quote text" — Author Name, Title'.
3. Highlights: If appropriate, add a highlight breakout box using:
:::highlight
### TITLE HERE
Text description here
:::
4. Dividers: Use '---' to separate sections.
5. Avoid general markdown characters like bold wrapping ** for whole headings (headings are already styled). 
6. Output raw text immediately. Do NOT wrap your output in backticks like "\`\`\`markdown\n...\n\`\`\`". Just output the raw markdown text. Must be entirely in written English.`;

        modelPrompt = `Compile the following inputs into a masterfully formatted English news story:
Raw Draft Materials:
"""
${text}
"""

Additional editorial directions: ${userPrompt || "none"}`;
      } else if (task === "rewrite") {
        systemInstruction = `You are an elite copy Editor in Univue Publications. Take the existing article text and rewrite it to fit the requested English publication style:
${presetGuidelines}

Keep the key facts but fully reposition the sentence structures, paragraph length, vocabulary, and intensity to match the chosen outlet perfectly.
Formatting output rules:
- Keep or adapt headings using '#' and '##'.
- Capture citations using '> "Quote" — Author, Affiliation'.
- Keep/inject a ':::highlight' box summarizing key parameters if helpful.
- Output raw content directly with NO "\`\`\`markdown" backticks. Write in polished English.`;

        modelPrompt = `Rewrite this article completely block by block:
"""
${text}
"""

Additional tone requests: ${userPrompt || "none"}`;
      } else if (task === "headlines") {
        systemInstruction = `You are a headline editor for Univue Consultants ApS publications. 
Generate 5 compelling, highly clickable (but non-clickbait) headline options in English corresponding to the selected brand style:
Preset: ${preset.toUpperCase()}
Style details: ${presetGuidelines}

Return the suggestions as a clear bulleted list in English so the user can easily select.`;
        modelPrompt = `Generate English headlines for the following article context:
"""
${text}
"""`;
      } else if (task === "extract-quotes") {
        systemInstruction = `You are a research desk assistant. Underline and extract the most impactful insights or quotes in the provided text.
Format them as beautiful English citations using:
> "The quote text" — Name, Role/Agency

Make sure to translate the quotes to English if the input is in another language. Return 2-3 prominent quotes. Do NOT output backticks.`;
        modelPrompt = `Extract quotes from:
"""
${text}
"""`;
      } else if (task === "optimize") {
        systemInstruction = `You are an English proofreader. Retain the exact block structures, headings, highlight tables, and quotes, but elevate the vocabulary, fix grammar, clear up passive sentences, and polish the flow of the English text. 
Return the polished article preserving all formatting rules (headings, citations, and highlight blocks with NO "\`\`\`markdown" wrappers).`;
        modelPrompt = `Optimize and proofread this English draft:
"""
${text}
"""`;
      }

      console.log(`Sending editorial task "${task}" for preset "${preset}" to Gemini...`);
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: modelPrompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const resultText = response.text || "";
      res.json({ success: true, text: resultText });
    } catch (error: any) {
      console.error("Editorial Copilot API Error:", error);
      res.status(500).json({ error: error.message || "An unexpected error occurred in your Editorial Co-pilot." });
    }
  });

  // Newsletter Sending Endpoint
  app.post("/api/admin/send-newsletter", async (req, res) => {
    try {
      const { subject, html, recipients } = req.body;

      if (!resend) {
        return res.status(500).json({ error: "Newsletter service not configured. Please add RESEND_API_KEY under Settings > Secrets." });
      }

      if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
        return res.status(400).json({ error: "Recipients list is required." });
      }

      console.log(`Sending personalized newsletters to ${recipients.length} recipients...`);

      const origin = req.headers.origin || "https://univueconsultants.com";
      const sendPromises = recipients.map(async (recipient: any) => {
        let recipientEmail = "";
        let recipientName = "Subscriber";

        if (typeof recipient === "string") {
          recipientEmail = recipient;
          recipientName = recipient.split("@")[0];
        } else if (recipient && typeof recipient === "object") {
          recipientEmail = recipient.email;
          recipientName = recipient.displayName || recipient.firstName || recipient.name || recipientEmail.split("@")[0];
        }

        if (!recipientEmail) return null;

        const unsubUrl = `${origin}/insights?unsub=${encodeURIComponent(recipientEmail)}`;

        // Replace template variables (support {{name}}, {{ name }}, {{Name}}, %7B%7Bname%7D%7D, url encoded spaces etc.)
        let personalizedHtml = html;
        personalizedHtml = personalizedHtml
          .replace(/\{\{\s*name\s*\}\}/gi, recipientName)
          .replace(/%7[bB]%7[bB](\s*(%20)*)*name(\s*(%20)*)*%7[dD]%7[dD]/gi, recipientName)
          .replace(/\{\{\s*unsub\s*\}\}/gi, unsubUrl)
          .replace(/%7[bB]%7[bB](\s*(%20)*)*unsub(\s*(%20)*)*%7[dD]%7[dD]/gi, unsubUrl)
          .replace(/\{\{\s*email\s*\}\}/gi, recipientEmail)
          .replace(/%7[bB]%7[bB](\s*(%20)*)*email(\s*(%20)*)*%7[dD]%7[dD]/gi, recipientEmail);

        try {
          return await resend.emails.send({
            from: 'Univue Intelligence <newsletter@univue.consulting>',
            to: recipientEmail,
            subject: subject,
            html: personalizedHtml,
          });
        } catch (postError: any) {
          console.error(`Failed to send newsletter to ${recipientEmail}:`, postError);
          return { error: postError?.message || String(postError), email: recipientEmail };
        }
      });

      const results = await Promise.all(sendPromises);
      res.json({ success: true, results });
    } catch (error: any) {
      console.error("Newsletter Send Error:", error);
      res.status(500).json({ error: "Internal server error during newsletter distribution." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
