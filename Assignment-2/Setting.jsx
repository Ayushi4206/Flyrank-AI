import { useState } from "react";

/**
 * SettingsForm
 * ----------------------------------------------------------------------
 * A self-contained settings form with Username, Email, and Password
 * fields, plus client-side validation and inline error messaging.
 *
 * VALIDATION RULES
 *   - username: required, minimum 3 characters
 *   - email:    required, must match a standard email pattern
 *   - password: required, minimum 8 characters
 *
 * USAGE
 *   <SettingsForm onSubmit={(values) => saveSettings(values)} />
 *
 * ----------------------------------------------------------------------
 * VERIFICATION / TESTING CHECKLIST
 * Run through these manually, or adapt into unit tests (e.g. with
 * React Testing Library) before shipping:
 *
 *  [ ] Empty submit          -> all three fields show "required" errors,
 *                                onSubmit is NOT called.
 *  [ ] Username "ab"         -> shows "at least 3 characters" error.
 *  [ ] Username "abc"        -> error clears, field outlined as valid.
 *  [ ] Email "not-an-email"  -> shows "valid email address" error.
 *  [ ] Email "a@b.co"        -> error clears.
 *  [ ] Password "short1"     -> shows "at least 8 characters" error.
 *  [ ] Password "longenough1"-> error clears.
 *  [ ] Valid data, submit    -> onSubmit fires once with {username,
 *                                email, password}; success message shown.
 *  [ ] Field touched + blurred with invalid value -> error shows
 *                                immediately (don't wait for submit).
 *  [ ] Fix an invalid field after a failed submit -> its error clears
 *                                on the next keystroke, without needing
 *                                to resubmit the whole form.
 *  [ ] Keyboard-only flow    -> can Tab through fields, focus rings are
 *                                visible, Enter submits the form.
 *  [ ] Screen reader check   -> error text is announced (aria-live /
 *                                aria-describedby wired to each input).
 * ----------------------------------------------------------------------
 */

const VALIDATORS = {
  username: (value) => {
    if (!value.trim()) return "Username is required.";
    if (value.trim().length < 3) return "Username must be at least 3 characters.";
    return null;
  },
  email: (value) => {
    if (!value.trim()) return "Email is required.";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) return "Enter a valid email address.";
    return null;
  },
  password: (value) => {
    if (!value) return "Password is required.";
    if (value.length < 8) return "Password must be at least 8 characters.";
    return null;
  },
};

const FIELD_CONFIG = [
  { name: "username", label: "Username", type: "text", autoComplete: "username" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "password", label: "Password", type: "password", autoComplete: "new-password" },
];

export default function SettingsForm({ onSubmit }) {
  const [values, setValues] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function validateField(name, value) {
    return VALIDATORS[name](value);
  }

  function validateAll(currentValues) {
    const nextErrors = {};
    Object.keys(VALIDATORS).forEach((name) => {
      const error = validateField(name, currentValues[name]);
      if (error) nextErrors[name] = error;
    });
    return nextErrors;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    const nextValues = { ...values, [name]: value };
    setValues(nextValues);

    // Re-validate live once a field has been touched, so fixing a
    // mistake clears the error immediately instead of waiting for submit.
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  }

  function handleBlur(e) {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const nextErrors = validateAll(values);
    setErrors(nextErrors);
    setTouched({ username: true, email: true, password: true });

    const isValid = Object.keys(nextErrors).length === 0;
    if (!isValid) {
      setSubmitted(false);
      return;
    }

    setSubmitted(true);
    if (onSubmit) onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={styles.form}>
      <h2 style={styles.heading}>Account Settings</h2>

      {FIELD_CONFIG.map(({ name, label, type, autoComplete }) => {
        const error = errors[name];
        const showError = Boolean(error) && touched[name];
        return (
          <div key={name} style={styles.field}>
            <label htmlFor={name} style={styles.label}>
              {label}
            </label>
            <input
              id={name}
              name={name}
              type={type}
              value={values[name]}
              autoComplete={autoComplete}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={showError}
              aria-describedby={showError ? `${name}-error` : undefined}
              style={{
                ...styles.input,
                ...(showError ? styles.inputError : {}),
              }}
            />
            <span
              id={`${name}-error`}
              role="alert"
              aria-live="polite"
              style={{
                ...styles.errorText,
                visibility: showError ? "visible" : "hidden",
              }}
            >
              {error || " "}
            </span>
          </div>
        );
      })}

      <button type="submit" style={styles.button}>
        Save changes
      </button>

      {submitted && (
        <p style={styles.successText} role="status">
          Settings saved successfully.
        </p>
      )}
    </form>
  );
}

const styles = {
  form: {
    maxWidth: 380,
    margin: "0 auto",
    padding: 24,
    borderRadius: 8,
    border: "1px solid #e2e2e2",
    background: "#ffffff",
    fontFamily: "system-ui, -apple-system, sans-serif",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  },
  heading: {
    margin: "0 0 20px",
    fontSize: 20,
    fontWeight: 600,
    color: "#1a1a1a",
  },
  field: {
    marginBottom: 16,
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: 13,
    fontWeight: 500,
    color: "#444",
    marginBottom: 6,
  },
  input: {
    padding: "10px 12px",
    fontSize: 14,
    borderRadius: 6,
    border: "1px solid #cccccc",
    outline: "none",
    transition: "border-color 0.15s ease",
  },
  inputError: {
    borderColor: "#d64545",
  },
  errorText: {
    marginTop: 6,
    fontSize: 12.5,
    color: "#d64545",
    minHeight: 16,
  },
  button: {
    width: "100%",
    padding: "11px 0",
    marginTop: 4,
    fontSize: 14,
    fontWeight: 600,
    color: "#ffffff",
    background: "#2563eb",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  successText: {
    marginTop: 14,
    fontSize: 13,
    color: "#1f8a4c",
    textAlign: "center",
  },
};