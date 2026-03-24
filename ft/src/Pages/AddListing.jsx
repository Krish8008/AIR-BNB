import React, { useState } from "react";

const INITIAL_FORM = {
  title: "", description: "", image: "",
  price: "", country: "", location: "",
};

function validate(f) {
  const e = {};
  if (!f.title.trim())       e.title = "Required";
  if (!f.description.trim()) e.description = "Required";
  if (!f.image.trim())       e.image = "Required";
  else { try { new URL(f.image); } catch { e.image = "Invalid URL"; } }
  if (!f.price)              e.price = "Required";
  else if (Number(f.price) <= 0) e.price = "Must be > 0";
  if (!f.location.trim())    e.location = "Required";
  if (!f.country.trim())     e.country = "Required";
  return e;
}

const I = {
  page: {
    height: "100vh", width: "100vw", boxSizing: "border-box",
    background: "#f7f6f3", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    padding: "0 32px", fontFamily: "'Segoe UI', sans-serif", overflow: "hidden",
  },
  card: {
    width: "100%", maxWidth: 1100, background: "#fff",
    borderRadius: 20, boxShadow: "0 4px 28px rgba(0,0,0,0.08)",
    padding: "32px 36px", boxSizing: "border-box",
  },
  header: { marginBottom: 22 },
  h2: { margin: 0, fontSize: 20, fontWeight: 800, color: "#111" },
  sub: { margin: "3px 0 0", fontSize: 12, color: "#aaa" },
  // Row 1: Title + Description side by side
  row: { display: "flex", gap: 16, marginBottom: 14 },
  // Row 2: Image + Price + Location + Country
  row2: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 16, marginBottom: 14 },
  label: {
    display: "block", fontSize: 11, fontWeight: 700, color: "#6b7280",
    textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5,
  },
  req: { color: "#f43f5e", marginLeft: 2 },
  input: {
    width: "100%", padding: "9px 13px", border: "1.5px solid #e5e7eb",
    borderRadius: 10, fontSize: 13, color: "#111", outline: "none",
    boxSizing: "border-box", background: "#fafafa", fontFamily: "inherit",
    transition: "border-color 0.2s",
  },
  inputErr: { borderColor: "#f87171", background: "#fff8f8" },
  textarea: {
    width: "100%", padding: "9px 13px", border: "1.5px solid #e5e7eb",
    borderRadius: 10, fontSize: 13, color: "#111", outline: "none",
    boxSizing: "border-box", background: "#fafafa", fontFamily: "inherit",
    resize: "none", height: 68,
  },
  errTxt: { fontSize: 10, color: "#f43f5e", marginTop: 3 },
  actions: { display: "flex", gap: 12, marginTop: 4 },
  btnPrimary: {
    flex: 1, background: "#f43f5e", color: "#fff", border: "none",
    borderRadius: 11, padding: "11px 0", fontSize: 13, fontWeight: 700,
    cursor: "pointer", display: "flex", alignItems: "center",
    justifyContent: "center", gap: 7,
  },
  btnReset: {
    width: 90, background: "transparent", color: "#6b7280",
    border: "1.5px solid #e5e7eb", borderRadius: 11, padding: "11px 0",
    fontSize: 13, fontWeight: 600, cursor: "pointer",
  },
  banner: (type) => ({
    display: "flex", alignItems: "center", gap: 8,
    padding: "8px 14px", borderRadius: 10, fontSize: 12, marginBottom: 16,
    background: type === "success" ? "#f0fdf4" : "#fff1f2",
    border: `1px solid ${type === "success" ? "#bbf7d0" : "#fecdd3"}`,
    color: type === "success" ? "#16a34a" : "#e11d48",
  }),
};

export default function AddListing() {
  const [formData, setFormData]   = useState(INITIAL_FORM);
  const [errors, setErrors]       = useState({});
  const [touched, setTouched]     = useState({});
  const [status, setStatus]       = useState("idle");
  const [serverMsg, setServerMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (touched[name]) {
      const ve = validate({ ...formData, [name]: value });
      setErrors((p) => ({ ...p, [name]: ve[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
    setErrors((p) => ({ ...p, [name]: validate(formData)[name] }));
  };

  const handleSubmit = async () => {
    const allTouched = Object.fromEntries(
      Object.keys(INITIAL_FORM).map((k) => [k, true])
    );
    setTouched(allTouched);
    const ve = validate(formData);
    if (Object.keys(ve).length > 0) { setErrors(ve); return; }
    setStatus("loading");
    try {
      const res = await fetch("http://localhost:3000/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing: { ...formData, price: Number(formData.price) } }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setFormData(INITIAL_FORM); setTouched({}); setErrors({});
      } else {
        setStatus("error"); setServerMsg(data.message || "Something went wrong.");
      }
    } catch {
      setStatus("error"); setServerMsg("Network error — is your server running?");
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM); setErrors({}); setTouched({});
    setStatus("idle"); setServerMsg("");
  };

  const inp = (name) => ({
    ...I.input, ...(errors[name] && touched[name] ? I.inputErr : {}),
  });

  return (
    <div style={I.page}>
      <div style={I.card}>

        {/* Header */}
        <div style={I.header}>
          <h2 style={I.h2}>Add New Listing</h2>
          <p style={I.sub}>Fields marked <span style={{ color: "#f43f5e" }}>*</span> are required</p>
        </div>

        {/* Banners */}
        {status === "success" && (
          <div style={I.banner("success")}>
            ✅ Listing added successfully!
            <button onClick={handleReset} style={{ marginLeft: "auto", background: "none", border: "none", color: "#16a34a", cursor: "pointer", textDecoration: "underline", fontSize: 12 }}>
              Add another
            </button>
          </div>
        )}
        {status === "error" && (
          <div style={I.banner("error")}>⚠️ {serverMsg}</div>
        )}

        {/* Row 1 — Title (flex:2) + Description (flex:3) */}
        <div style={I.row}>
          <div style={{ flex: 2 }}>
            <label style={I.label}>Title<span style={I.req}>*</span></label>
            <input
              type="text" name="title" value={formData.title}
              onChange={handleChange} onBlur={handleBlur}
              placeholder="Cozy Beach House in Goa"
              style={inp("title")}
            />
            {errors.title && touched.title && <p style={I.errTxt}>{errors.title}</p>}
          </div>
          <div style={{ flex: 3 }}>
            <label style={I.label}>Description<span style={I.req}>*</span></label>
            <textarea
              name="description" value={formData.description}
              onChange={handleChange} onBlur={handleBlur}
              placeholder="Describe your place..."
              style={{ ...I.textarea, ...(errors.description && touched.description ? I.inputErr : {}) }}
            />
            {errors.description && touched.description && <p style={I.errTxt}>{errors.description}</p>}
          </div>
        </div>

        {/* Row 2 — Image URL (2fr) + Price (1fr) + Location (1fr) + Country (1fr) */}
        <div style={I.row2}>
          <div>
            <label style={I.label}>Image URL<span style={I.req}>*</span></label>
            <input
              type="url" name="image" value={formData.image}
              onChange={handleChange} onBlur={handleBlur}
              placeholder="https://example.com/photo.jpg"
              style={inp("image")}
            />
            {errors.image && touched.image && <p style={I.errTxt}>{errors.image}</p>}
          </div>
          <div>
            <label style={I.label}>Price / Night (₹)<span style={I.req}>*</span></label>
            <input
              type="number" name="price" value={formData.price} min={1}
              onChange={handleChange} onBlur={handleBlur}
              placeholder="2500"
              style={inp("price")}
            />
            {errors.price && touched.price && <p style={I.errTxt}>{errors.price}</p>}
          </div>
          <div>
            <label style={I.label}>Location<span style={I.req}>*</span></label>
            <input
              type="text" name="location" value={formData.location}
              onChange={handleChange} onBlur={handleBlur}
              placeholder="Calangute Beach"
              style={inp("location")}
            />
            {errors.location && touched.location && <p style={I.errTxt}>{errors.location}</p>}
          </div>
          <div>
            <label style={I.label}>Country<span style={I.req}>*</span></label>
            <input
              type="text" name="country" value={formData.country}
              onChange={handleChange} onBlur={handleBlur}
              placeholder="India"
              style={inp("country")}
            />
            {errors.country && touched.country && <p style={I.errTxt}>{errors.country}</p>}
          </div>
        </div>

        {/* Actions */}
        <div style={I.actions}>
          <button onClick={handleSubmit} disabled={status === "loading"} style={{ ...I.btnPrimary, opacity: status === "loading" ? 0.7 : 1 }}>
            {status === "loading" ? (
              <>
                <svg style={{ animation: "spin 1s linear infinite", width: 13, height: 13 }} fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" opacity="0.3" />
                  <path fill="white" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Submitting...
              </>
            ) : "Add Listing"}
          </button>
          <button onClick={handleReset} style={I.btnReset}>Reset</button>
        </div>

      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}