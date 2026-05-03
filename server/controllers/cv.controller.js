const fs = require('fs');
const pdfParse = require('pdf-parse');
const Groq = require('groq-sdk');

const parseCV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No CV file uploaded.' });
        }

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'GROQ_API_KEY is not configured in the server .env file.' });
        }

        // 1. Read text from the uploaded PDF
        const dataBuffer = fs.readFileSync(req.file.path);
        const data = await pdfParse(dataBuffer);
        const cvText = data.text;

        // Clean up the uploaded file to save disk space
        try { fs.unlinkSync(req.file.path); } catch (e) { console.error('Could not delete temp file', e); }

        // 2. Setup Groq client
        const groq = new Groq({ apiKey });

        // 3. Send to Groq (using free LLaMA model)
        const completion = await groq.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert CV parser. Always respond with only raw JSON, no markdown, no explanation, no code blocks.'
                },
                {
                    role: 'user',
                    content: `Extract the following information from this CV and return it strictly as a JSON object (no markdown, no extra text, just raw JSON).

Required JSON structure:
{
  "baccalaureate": "Year of baccalaureate (e.g. 2022) or empty string",
  "githubPortfolio": "GitHub or portfolio URL if found, else empty string",
  "phoneNumber": "Phone number if found, else empty string",
  "bio": "A short 1-3 sentence professional summary based on the CV",
  "expectedGraduationDate": "Expected graduation year (e.g. 2026) or empty string",
  "skills": ["array", "of", "top", "skills", "found"],
  "academicProjects": [
    {
      "title": "Project title",
      "role": "Role or description",
      "technologies": "Technologies used",
      "link": "URL if available else empty string",
      "result": "Result or summary"
    }
  ],
  "experience": [
    {
      "type": "Part-time jobs",
      "role": "Role title",
      "description": "Brief description"
    }
  ]
}

CV Text:
${cvText.substring(0, 6000)}`
                }
            ],
            temperature: 0.2,
            max_tokens: 2048
        });

        let responseText = completion.choices[0]?.message?.content?.trim() || '';

        // Strip markdown code blocks if model wraps response
        responseText = responseText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

        const parsedData = JSON.parse(responseText);
        res.status(200).json({ success: true, data: parsedData });

    } catch (err) {
        console.error('Error parsing CV:', err);

        if (err.status === 429) {
            return res.status(429).json({
                success: false,
                error: 'Rate limit reached. Please wait a minute and try again.'
            });
        }

        res.status(500).json({ success: false, error: 'Failed to parse CV: ' + err.message });
    }
};

module.exports = { parseCV };
