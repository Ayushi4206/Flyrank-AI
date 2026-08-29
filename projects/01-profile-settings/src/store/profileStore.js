/** In-memory profile store — replace with a database in production. */

const defaultProfile = {
  fullName: "Jane Doe",
  email: "jane@example.com",
  phone: "",
  company: "FlyRank AI",
  jobTitle: "Content Strategist",
  website: "",
  bio: "",
  timezone: "America/New_York",
  emailNotifications: true,
  weeklyDigest: false,
};

let profile = { ...defaultProfile };

function getProfile() {
  return { ...profile };
}

function updateProfile(data) {
  profile = { ...profile, ...data };
  return getProfile();
}

module.exports = { getProfile, updateProfile };
