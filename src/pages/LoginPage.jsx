import React, { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Please input your email!" }));
      return;
    }
    if (!email.includes("@")) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email!" }));
      return;
    }
    if (!password) {
      setErrors((prev) => ({
        ...prev,
        password: "Please input your password!",
      }));
      return;
    }

    if (email === "admin@admin.com" && password === "admin123") {
      window.location.href = "/dashboard";
    } else {
      setErrors({ general: "Invalid credentials" });
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f2f5",
      }}
    >
      <div
        style={{
          width: 400,
          padding: 24,
          backgroundColor: "white",
          borderRadius: 8,
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        }}
      >
        <div onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              style={{
                width: "100%",
                padding: "8px 11px",
                border: errors.email
                  ? "1px solid #ff4d4f"
                  : "1px solid #d9d9d9",
                borderRadius: 6,
                fontSize: 14,
                outline: "none",
              }}
            />
            {errors.email && (
              <div style={{ color: "#ff4d4f", fontSize: 12, marginTop: 4 }}>
                {errors.email}
              </div>
            )}
          </div>

          <div style={{ marginBottom: 24 }}>
            <label
              style={{ display: "block", marginBottom: 8, fontWeight: 500 }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              style={{
                width: "100%",
                padding: "8px 11px",
                border: errors.password
                  ? "1px solid #ff4d4f"
                  : "1px solid #d9d9d9",
                borderRadius: 6,
                fontSize: 14,
                outline: "none",
              }}
            />
            {errors.password && (
              <div style={{ color: "#ff4d4f", fontSize: 12, marginTop: 4 }}>
                {errors.password}
              </div>
            )}
          </div>

          {errors.general && (
            <div
              style={{
                color: "#ff4d4f",
                fontSize: 14,
                marginBottom: 16,
                textAlign: "center",
              }}
            >
              {errors.general}
            </div>
          )}

          <button
            onClick={handleSubmit}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#1890ff",
              color: "white",
              border: "none",
              borderRadius: 6,
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
