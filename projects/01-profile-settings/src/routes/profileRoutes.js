const express = require("express");
const { validateProfile } = require("../schemas/profileSchema");
const { getProfile, updateProfile } = require("../store/profileStore");

const router = express.Router();

router.get("/", (_req, res) => {
  res.json({ profile: getProfile() });
});

router.put("/", (req, res) => {
  const result = validateProfile(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Validation failed",
      errors: result.errors,
    });
  }

  const profile = updateProfile(result.data);
  res.json({ message: "Profile updated successfully", profile });
});

module.exports = router;
