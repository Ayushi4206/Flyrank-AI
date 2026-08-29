const express = require("express");
const path = require("path");
const profileRoutes = require("./src/routes/profileRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/profile", profileRoutes);

app.get("/settings/profile", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "profile.html"));
});

app.get("/", (_req, res) => {
  res.redirect("/settings/profile");
});

app.use((_req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.listen(PORT, () => {
  console.log(`FlyRank AI running at http://localhost:${PORT}`);
  console.log(`Profile settings: http://localhost:${PORT}/settings/profile`);
});
