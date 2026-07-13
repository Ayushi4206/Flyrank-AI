const form = document.getElementById("profile-form");
const alertEl = document.getElementById("form-alert");
const submitBtn = document.getElementById("submit-btn");
const resetBtn = document.getElementById("reset-btn");
const bioField = document.getElementById("bio");
const bioCount = document.getElementById("bio-count");

const FIELDS = [
  "fullName",
  "email",
  "phone",
  "company",
  "jobTitle",
  "website",
  "bio",
  "timezone",
];

const validators = {
  fullName(value) {
    const trimmed = value.trim();
    if (!trimmed) return "Full name is required";
    if (trimmed.length < 2) return "Full name must be at least 2 characters";
    if (trimmed.length > 100) return "Full name must be at most 100 characters";
    return null;
  },

  email(value) {
    const trimmed = value.trim();
    if (!trimmed) return "Email is required";
    if (trimmed.length > 255) return "Email must be at most 255 characters";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return "Enter a valid email address";
    }
    return null;
  },

  phone(value) {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (!/^\+?[\d\s\-().]{7,20}$/.test(trimmed)) {
      return "Enter a valid phone number";
    }
    return null;
  },

  company(value) {
    if (value.trim().length > 100) {
      return "Company name must be at most 100 characters";
    }
    return null;
  },

  jobTitle(value) {
    if (value.trim().length > 100) {
      return "Job title must be at most 100 characters";
    }
    return null;
  },

  website(value) {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (trimmed.length > 500) return "Website URL must be at most 500 characters";
    try {
      new URL(trimmed);
      return null;
    } catch {
      return "Enter a valid URL (include https://)";
    }
  },

  bio(value) {
    if (value.trim().length > 500) {
      return "Bio must be at most 500 characters";
    }
    return null;
  },

  timezone(value) {
    if (!value) return "Select a timezone";
    return null;
  },
};

function getFieldValue(name) {
  const el = form.elements[name];
  if (!el) return "";
  if (el.type === "checkbox") return el.checked;
  return el.value;
}

function setFieldError(name, message) {
  const input = form.elements[name];
  const errorEl = document.getElementById(`error-${name}`);

  if (message) {
    input?.classList.add("invalid");
    if (errorEl) errorEl.textContent = message;
  } else {
    input?.classList.remove("invalid");
    if (errorEl) errorEl.textContent = "";
  }
}

function clearAllErrors() {
  for (const name of FIELDS) {
    setFieldError(name, null);
  }
}

function validateField(name) {
  const value = getFieldValue(name);
  const error = validators[name](value);
  setFieldError(name, error);
  return !error;
}

function validateForm() {
  let isValid = true;
  for (const name of FIELDS) {
    if (!validateField(name)) {
      isValid = false;
    }
  }
  return isValid;
}

function showAlert(message, type) {
  alertEl.textContent = message;
  alertEl.className = `alert ${type}`;
  alertEl.hidden = false;
}

function hideAlert() {
  alertEl.hidden = true;
  alertEl.textContent = "";
}

function updateBioCount() {
  const length = bioField.value.length;
  bioCount.textContent = `${length} / 500`;
  bioCount.style.color =
    length > 500 ? "var(--error)" : "var(--text-muted)";
}

function populateForm(profile) {
  for (const name of FIELDS) {
    const el = form.elements[name];
    if (!el) continue;
    el.value = profile[name] ?? "";
  }

  form.elements.emailNotifications.checked = Boolean(profile.emailNotifications);
  form.elements.weeklyDigest.checked = Boolean(profile.weeklyDigest);
  updateBioCount();
  clearAllErrors();
  hideAlert();
}

function getFormData() {
  return {
    fullName: getFieldValue("fullName"),
    email: getFieldValue("email"),
    phone: getFieldValue("phone"),
    company: getFieldValue("company"),
    jobTitle: getFieldValue("jobTitle"),
    website: getFieldValue("website"),
    bio: getFieldValue("bio"),
    timezone: getFieldValue("timezone"),
    emailNotifications: getFieldValue("emailNotifications"),
    weeklyDigest: getFieldValue("weeklyDigest"),
  };
}

async function loadProfile() {
  try {
    const response = await fetch("/api/profile");
    if (!response.ok) throw new Error("Failed to load profile");
    const { profile } = await response.json();
    populateForm(profile);
  } catch {
    showAlert("Could not load your profile. Please refresh the page.", "error");
  }
}

async function saveProfile(event) {
  event.preventDefault();
  hideAlert();

  if (!validateForm()) {
    showAlert("Please fix the errors below before saving.", "error");
    const firstInvalid = form.querySelector(".invalid");
    firstInvalid?.focus();
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Saving...";

  try {
    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(getFormData()),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.errors) {
        for (const [field, message] of Object.entries(data.errors)) {
          setFieldError(field, message);
        }
      }
      showAlert(data.message || "Failed to save profile.", "error");
      return;
    }

    populateForm(data.profile);
    showAlert("Profile updated successfully.", "success");
  } catch {
    showAlert("Network error. Please try again.", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Save changes";
  }
}

for (const name of FIELDS) {
  const el = form.elements[name];
  if (!el) continue;

  el.addEventListener("blur", () => validateField(name));
  el.addEventListener("input", () => {
    if (el.classList.contains("invalid")) {
      validateField(name);
    }
    if (name === "bio") updateBioCount();
  });
}

bioField.addEventListener("input", updateBioCount);
form.addEventListener("submit", saveProfile);
resetBtn.addEventListener("click", loadProfile);

loadProfile();
