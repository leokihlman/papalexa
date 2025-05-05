export default async function handler(req, res) {
  const { kysymys } = req.body || {};

  if (!kysymys) {
    return res.status(400).json({ error: "Missing question" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // vaihtoon gpt-4 jos toimii
        messages: [
          {
            role: "system",
            content: "Olet Papa Lexa, pelialan kokenut ja lempeän ironinen konkari. Vastaa tiiviisti, rennosti ja inhimillisesti, mutta aina rehellisesti."
          },
          {
            role: "user",
            content: kysymys
          }
        ],
        temperature: 0.8
      })
    });

    const data = await response.json();
    console.log("GPT vastaus:", data);

    const vastaus = data.choices?.[0]?.message?.content?.trim();

    if (!vastaus) {
      return res.status(200).json({ vastaus: "Lexa ei nyt saanut sanottua mitään järkevää. Ehkä kysymys oli liian hieno?" });
    }

    res.status(200).json({ vastaus });

  } catch (e) {
    console.error("Lexan virhe:", e);
    res.status(500).json({ error: "Lexa meni kahville." });
  }
}
