// /api/ask.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { kysymys } = req.body;

  if (!kysymys) {
    return res.status(400).json({ error: 'Missing question' });
  }

  console.log("Kysymys:", kysymys);
  console.log("API-avain paikalla:", !!process.env.OPENAI_API_KEY);

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o', // 🔥 vaihda tähän oikea ja toimiva malli!
        messages: [
          {
            role: 'system',
            content: 'Olet Papa Lexa, pelialan konkari. Vastauksesi ovat lyhyitä, suoria, hieman lakonisia ja täynnä inhimillistä kokemusta.',
          },
          {
            role: 'user',
            content: kysymys,
          },
        ],
        temperature: 0.8,
      }),
    });

    const data = await response.json();
    console.log("OpenAI-palautus:", data);

    const lexanVastaus = data.choices?.[0]?.message?.content;

    if (!lexanVastaus) {
      return res.json({ vastaus: "Lexa ei nyt saanut sanottua mitään järkevää. Ehkä kysymys oli liian hieno?" });
    }

    return res.json({ vastaus: lexanVastaus });

  } catch (err) {
    console.error("Virhe GPT-haussa:", err);
    return res.status(500).json({ error: 'Jokin meni pieleen GPT-kutsussa' });
  }
}
