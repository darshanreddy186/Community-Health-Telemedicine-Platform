const router = require('express').Router();
const https = require('https');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ reply: 'No message provided.' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ reply: 'Chatbot is not configured (missing API key).' });

  const body = JSON.stringify({
    contents: [{
      role: 'user',
      parts: [{
        text: `You are a helpful healthcare assistant for HealthConnect. Answer briefly in 2-3 sentences. User question: ${message}`
      }]
    }],
    generationConfig: {
      maxOutputTokens: 200,
      temperature: 0.7
    }
  });

  // Try gemini-1.5-flash — widely available on free tier
  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body)
    }
  };

  const request = https.request(options, (response) => {
    let data = '';
    response.on('data', chunk => data += chunk);
    response.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        console.log('Gemini status:', response.statusCode);

        // Surface API-level errors clearly
        if (parsed.error) {
          console.error('Gemini API error:', parsed.error);
          if (parsed.error.code === 429) {
            return res.status(429).json({ reply: 'The AI assistant is temporarily rate-limited. Please wait a few seconds and try again.' });
          }
          return res.status(500).json({ reply: `Gemini error: ${parsed.error.message}` });
        }

        const reply = parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!reply) {
          console.error('Unexpected Gemini response shape:', JSON.stringify(parsed));
          return res.status(500).json({ reply: 'No response from AI. Please try again.' });
        }

        res.json({ reply: reply.trim() });
      } catch (e) {
        console.error('Parse error:', e.message, 'Raw:', data.slice(0, 300));
        res.status(500).json({ reply: 'Failed to parse Gemini response.' });
      }
    });
  });

  request.on('error', (e) => {
    console.error('HTTPS request error:', e.message);
    res.status(500).json({ reply: 'Failed to reach Gemini API.' });
  });

  request.write(body);
  request.end();
});

module.exports = router;
