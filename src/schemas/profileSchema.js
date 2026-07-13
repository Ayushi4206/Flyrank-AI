const { z } = require("zod");

const profileSchema = z.object({
  fullName: z
    .string({ required_error: "Full name is required" })
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be at most 100 characters"),

  email: z
    .string({ required_error: "Email is required" })
    .trim()
    .email("Enter a valid email address")
    .max(255, "Email must be at most 255 characters"),

  phone: z.union([
    z.literal(""),
    z
      .string()
      .trim()
      .regex(/^\+?[\d\s\-().]{7,20}$/, "Enter a valid phone number"),
  ]),

  company: z
    .string()
    .trim()
    .max(100, "Company name must be at most 100 characters"),

  jobTitle: z
    .string()
    .trim()
    .max(100, "Job title must be at most 100 characters"),

  website: z.union([
    z.literal(""),
    z
      .string()
      .trim()
      .url("Enter a valid URL (include https://)")
      .max(500, "Website URL must be at most 500 characters"),
  ]),

  bio: z
    .string()
    .trim()
    .max(500, "Bio must be at most 500 characters"),

  timezone: z
    .string({ required_error: "Timezone is required" })
    .min(1, "Select a timezone"),

  emailNotifications: z.boolean().default(true),
  weeklyDigest: z.boolean().default(false),
});

/**
 * Normalize empty strings to undefined for optional fields.
 */
function normalizeProfileInput(body) {
  const asString = (value) => (typeof value === "string" ? value : "");

  return {
    fullName: asString(body.fullName),
    email: asString(body.email),
    phone: asString(body.phone).trim(),
    company: asString(body.company),
    jobTitle: asString(body.jobTitle),
    website: asString(body.website).trim(),
    bio: asString(body.bio),
    timezone: asString(body.timezone),
    emailNotifications:
      body.emailNotifications === true || body.emailNotifications === "true",
    weeklyDigest: body.weeklyDigest === true || body.weeklyDigest === "true",
  };
}

/**
 * Validate profile input and return parsed data or field errors.
 */
function validateProfile(body) {
  const normalized = normalizeProfileInput(body);
  const result = profileSchema.safeParse(normalized);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (!errors[field]) {
      errors[field] = issue.message;
    }
  }

  return { success: false, errors };
}

module.exports = { profileSchema, normalizeProfileInput, validateProfile };
