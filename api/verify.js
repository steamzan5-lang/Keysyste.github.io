export default function handler(req, res) {
  const validKeys = ["ABC123", "DEF456", "GHI789"]; // daftar key valid

  if (req.method === "POST") {
    const { key } = req.body;

    if (validKeys.includes(key)) {
      res.status(200).json({ success: true, message: "Key valid" });
    } else {
      res.status(401).json({ success: false, message: "Key invalid" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
