import { useState, useEffect, createContext, useContext } from "react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const API_BASE = import.meta?.env?.VITE_API_URL || "http://localhost:4000/api/v1";

const api = {
  post: async (url, body, withAuth = false) => {
    const headers = { "Content-Type": "application/json" };
    const res = await fetch(`${API_BASE}${url}`, {
      method: "POST",
      headers,
      credentials: "include", // sends cookies automatically
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
  },
  get: async (url) => {
    const res = await fetch(`${API_BASE}${url}`, {
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
  },
};

// ─── AUTH CONTEXT ─────────────────────────────────────────────────────────────
const AuthContext = createContext(null);
const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ts_user")); } catch { return null; }
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("ts_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ts_user");
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const injectStyles = () => {
  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --ink: #0a0a0f;
      --paper: #f5f2eb;
      --cream: #ede9df;
      --accent: #c8f04a;
      --accent2: #ff5c3a;
      --muted: #7a7668;
      --border: #d4cfc3;
      --card: #ffffff;
      --success: #2ecc71;
      --error: #e74c3c;
      --radius: 16px;
      --shadow: 0 4px 24px rgba(10,10,15,0.08);
      --shadow-lg: 0 12px 48px rgba(10,10,15,0.14);
    }

    body {
      font-family: 'DM Mono', monospace;
      background: var(--paper);
      color: var(--ink);
      min-height: 100vh;
    }

    /* ── LAYOUT ── */
    .app-shell { min-height: 100vh; display: flex; flex-direction: column; }

    /* ── NAV ── */
    .nav {
      display: flex; align-items: center; justify-content: space-between;
      padding: 20px 40px; border-bottom: 1.5px solid var(--border);
      background: var(--paper); position: sticky; top: 0; z-index: 100;
      backdrop-filter: blur(12px);
    }
    .nav-logo {
      font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.4rem;
      letter-spacing: -0.5px; color: var(--ink);
    }
    .nav-logo span { color: var(--accent2); }
    .nav-right { display: flex; gap: 12px; align-items: center; }
    .nav-user {
      font-size: 0.75rem; color: var(--muted);
      background: var(--cream); padding: 6px 14px; border-radius: 99px;
      border: 1px solid var(--border);
    }

    /* ── BUTTONS ── */
    .btn {
      font-family: 'DM Mono', monospace; font-size: 0.82rem; font-weight: 500;
      padding: 10px 22px; border-radius: 99px; border: 1.5px solid transparent;
      cursor: pointer; transition: all 0.18s ease; letter-spacing: 0.02em;
      display: inline-flex; align-items: center; gap: 8px;
    }
    .btn-primary {
      background: var(--ink); color: var(--accent); border-color: var(--ink);
    }
    .btn-primary:hover { background: #1a1a24; transform: translateY(-1px); box-shadow: var(--shadow); }
    .btn-accent {
      background: var(--accent); color: var(--ink); border-color: var(--accent);
    }
    .btn-accent:hover { background: #b8e040; transform: translateY(-1px); box-shadow: var(--shadow); }
    .btn-ghost {
      background: transparent; color: var(--ink); border-color: var(--border);
    }
    .btn-ghost:hover { background: var(--cream); border-color: var(--ink); }
    .btn-danger {
      background: transparent; color: var(--error); border-color: var(--error);
    }
    .btn-danger:hover { background: var(--error); color: white; }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }
    .btn-lg { padding: 14px 32px; font-size: 0.9rem; }
    .btn-full { width: 100%; justify-content: center; }

    /* ── CARD ── */
    .card {
      background: var(--card); border: 1.5px solid var(--border);
      border-radius: var(--radius); padding: 32px; box-shadow: var(--shadow);
    }
    .card-sm { padding: 20px; }

    /* ── FORM ── */
    .form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 18px; }
    .form-label { font-size: 0.72rem; font-weight: 500; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; }
    .form-input {
      font-family: 'DM Mono', monospace; font-size: 0.9rem;
      padding: 12px 16px; border: 1.5px solid var(--border);
      border-radius: 10px; background: var(--paper); color: var(--ink);
      transition: border-color 0.15s, box-shadow 0.15s; outline: none;
    }
    .form-input:focus { border-color: var(--ink); box-shadow: 0 0 0 3px rgba(10,10,15,0.06); }
    .form-input::placeholder { color: var(--border); }
    .form-error { font-size: 0.75rem; color: var(--error); margin-top: 2px; }

    /* ── AUTH PAGES ── */
    .auth-page {
      min-height: 100vh; display: flex;
      background: linear-gradient(135deg, var(--paper) 60%, var(--cream) 100%);
    }
    .auth-left {
      flex: 1; padding: 60px; display: flex; flex-direction: column;
      justify-content: center; max-width: 480px;
      border-right: 1.5px solid var(--border);
    }
    .auth-right {
      flex: 1; display: flex; align-items: center; justify-content: center;
      padding: 60px; background: var(--ink); position: relative; overflow: hidden;
    }
    .auth-right-bg {
      position: absolute; inset: 0;
      background: radial-gradient(ellipse at 30% 70%, rgba(200,240,74,0.12) 0%, transparent 60%),
                  radial-gradient(ellipse at 80% 20%, rgba(255,92,58,0.08) 0%, transparent 50%);
    }
    .auth-right-content { position: relative; z-index: 1; text-align: center; }
    .auth-big-text {
      font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(3rem, 6vw, 5rem);
      line-height: 1; color: var(--paper); letter-spacing: -2px;
    }
    .auth-big-text span { color: var(--accent); }
    .auth-tagline { font-size: 0.85rem; color: var(--muted); margin-top: 16px; max-width: 280px; line-height: 1.6; }
    .auth-dots { display: flex; gap: 6px; margin-top: 32px; justify-content: center; }
    .auth-dot { width: 8px; height: 8px; border-radius: 50%; }

    .auth-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.8rem; margin-bottom: 8px; }
    .auth-subtitle { font-size: 0.82rem; color: var(--muted); margin-bottom: 36px; }
    .auth-switch { font-size: 0.78rem; color: var(--muted); margin-top: 20px; text-align: center; }
    .auth-switch button { background: none; border: none; color: var(--ink); font-weight: 600; cursor: pointer; text-decoration: underline; font-family: 'DM Mono', monospace; font-size: 0.78rem; }

    /* ── DASHBOARD ── */
    .dashboard { max-width: 1100px; margin: 0 auto; padding: 40px 24px; }
    .dashboard-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 28px; }

    .balance-card {
      background: var(--ink); color: var(--paper); border-radius: var(--radius);
      padding: 36px; position: relative; overflow: hidden; grid-column: 1 / -1;
    }
    .balance-card::before {
      content: ''; position: absolute;
      width: 300px; height: 300px; border-radius: 50%;
      background: radial-gradient(circle, rgba(200,240,74,0.15), transparent 70%);
      top: -80px; right: -60px; pointer-events: none;
    }
    .balance-label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(245,242,235,0.5); margin-bottom: 12px; }
    .balance-amount {
      font-family: 'Syne', sans-serif; font-weight: 800; font-size: clamp(2.5rem, 5vw, 4rem);
      line-height: 1; letter-spacing: -2px;
    }
    .balance-amount .currency { font-size: 1.5rem; color: var(--accent); vertical-align: super; margin-right: 4px; }
    .balance-locked { font-size: 0.78rem; color: rgba(245,242,235,0.45); margin-top: 10px; }
    .balance-actions { display: flex; gap: 12px; margin-top: 28px; flex-wrap: wrap; }

    .stat-card { background: var(--card); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 24px; }
    .stat-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin-bottom: 10px; }
    .stat-value { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.6rem; }
    .stat-sub { font-size: 0.75rem; color: var(--muted); margin-top: 4px; }

    .section-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.1rem; margin-bottom: 16px; }

    /* ── DEPOSIT MODAL ── */
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(10,10,15,0.6);
      display: flex; align-items: center; justify-content: center;
      z-index: 1000; backdrop-filter: blur(6px);
      animation: fadeIn 0.2s ease;
    }
    .modal {
      background: var(--card); border-radius: 20px; padding: 40px;
      width: 100%; max-width: 420px; margin: 20px;
      box-shadow: var(--shadow-lg); animation: slideUp 0.25s ease;
    }
    .modal-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 1.4rem; margin-bottom: 6px; }
    .modal-sub { font-size: 0.78rem; color: var(--muted); margin-bottom: 28px; }
    .amount-presets { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
    .preset-btn {
      font-family: 'DM Mono', monospace; font-size: 0.78rem; padding: 8px 16px;
      border: 1.5px solid var(--border); background: var(--paper); border-radius: 8px;
      cursor: pointer; transition: all 0.15s; color: var(--ink);
    }
    .preset-btn:hover, .preset-btn.active {
      background: var(--ink); color: var(--accent); border-color: var(--ink);
    }
    .modal-footer { display: flex; gap: 10px; margin-top: 24px; }

    /* ── PAYMENT PAGES ── */
    .payment-page {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      padding: 24px;
    }
    .payment-box { max-width: 400px; width: 100%; text-align: center; }
    .payment-icon { font-size: 4rem; margin-bottom: 20px; display: block; }
    .payment-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 2rem; margin-bottom: 10px; }
    .payment-msg { font-size: 0.85rem; color: var(--muted); line-height: 1.6; margin-bottom: 28px; }

    /* ── ALERTS ── */
    .alert {
      padding: 12px 18px; border-radius: 10px; font-size: 0.8rem;
      margin-bottom: 16px; display: flex; align-items: center; gap: 8px;
    }
    .alert-error { background: #fef2f2; border: 1px solid #fecaca; color: var(--error); }
    .alert-success { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; }

    /* ── SPINNER ── */
    .spinner {
      width: 18px; height: 18px; border: 2px solid transparent;
      border-top-color: currentColor; border-radius: 50%;
      animation: spin 0.7s linear infinite; display: inline-block;
    }

    /* ── LOADING PAGE ── */
    .loading-page {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      flex-direction: column; gap: 16px;
    }
    .loading-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.8rem; }
    .loading-logo span { color: var(--accent2); }

    /* ── TICKER ── */
    .wallet-badge {
      display: inline-flex; align-items: center; gap: 6px;
      background: var(--cream); border: 1px solid var(--border);
      padding: 4px 12px; border-radius: 99px; font-size: 0.72rem; color: var(--muted);
    }
    .wallet-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--success); animation: pulse 2s infinite; }

    @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
    @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
    @keyframes spin { to { transform: rotate(360deg) } }
    @keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.4 } }

    @media (max-width: 768px) {
      .auth-right { display: none; }
      .auth-left { max-width: 100%; border-right: none; padding: 40px 28px; }
      .dashboard-grid { grid-template-columns: 1fr; }
      .nav { padding: 16px 20px; }
      .dashboard { padding: 24px 16px; }
    }
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
};

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function Spinner() {
  return <span className="spinner" />;
}

function Alert({ type = "error", children }) {
  return <div className={`alert alert-${type}`}>{children}</div>;
}

// ─── REGISTER PAGE ────────────────────────────────────────────────────────────
function RegisterPage({ onSwitch }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", fullname: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setError("");
    if (!form.username || !form.fullname || !form.email || !form.password) {
      return setError("All fields are required.");
    }
    setLoading(true);
    try {
      await api.post("/users/register", form);
      // After register, auto-login
      const res = await api.post("/users/login", { email: form.email, password: form.password });
      login(res.data?.loggedInUser);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-title">Create account</div>
        <div className="auth-subtitle">Join TrustSplit and manage your wallet</div>

        {error && <Alert>{error}</Alert>}

        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input className="form-input" name="fullname" placeholder="Rahul Sharma" value={form.fullname} onChange={handle} />
        </div>
        <div className="form-group">
          <label className="form-label">Username</label>
          <input className="form-input" name="username" placeholder="rahul_s" value={form.username} onChange={handle} />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" name="email" type="email" placeholder="rahul@email.com" value={form.email} onChange={handle} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle} />
        </div>

        <button className="btn btn-primary btn-lg btn-full" onClick={submit} disabled={loading}>
          {loading ? <><Spinner /> Creating account...</> : "Create Account →"}
        </button>

        <div className="auth-switch">
          Already have an account?{" "}
          <button onClick={onSwitch}>Sign in</button>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-right-bg" />
        <div className="auth-right-content">
          <div className="auth-big-text">
            Trust<br /><span>Split</span>
          </div>
          <div className="auth-tagline" style={{ color: "rgba(245,242,235,0.5)" }}>
            Secure escrow wallet for splitting expenses with people you trust.
          </div>
          <div className="auth-dots">
            {["#c8f04a", "#ff5c3a", "rgba(245,242,235,0.2)", "rgba(245,242,235,0.2)"].map((c, i) => (
              <div key={i} className="auth-dot" style={{ background: c }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ onSwitch }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setError("");
    if (!form.email || !form.password) return setError("Email and password required.");
    setLoading(true);
    try {
      const res = await api.post("/users/login", form);
      login(res.data?.loggedInUser);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === "Enter") submit(); };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-title">Welcome back</div>
        <div className="auth-subtitle">Sign in to your TrustSplit wallet</div>

        {error && <Alert>{error}</Alert>}

        <div className="form-group">
          <label className="form-label">Email or Username</label>
          <input className="form-input" name="email" placeholder="rahul@email.com" value={form.email} onChange={handle} onKeyDown={handleKey} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handle} onKeyDown={handleKey} />
        </div>

        <button className="btn btn-primary btn-lg btn-full" onClick={submit} disabled={loading}>
          {loading ? <><Spinner /> Signing in...</> : "Sign In →"}
        </button>

        <div className="auth-switch">
          Don't have an account?{" "}
          <button onClick={onSwitch}>Create one</button>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-right-bg" />
        <div className="auth-right-content">
          <div className="auth-big-text">
            Trust<br /><span>Split</span>
          </div>
          <div className="auth-tagline" style={{ color: "rgba(245,242,235,0.5)" }}>
            Your money, secured in escrow until everyone agrees.
          </div>
          <div className="auth-dots">
            {["#c8f04a", "#ff5c3a", "rgba(245,242,235,0.2)", "rgba(245,242,235,0.2)"].map((c, i) => (
              <div key={i} className="auth-dot" style={{ background: c }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DEPOSIT MODAL ────────────────────────────────────────────────────────────
function DepositModal({ onClose }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const presets = [100, 250, 500, 1000, 2000, 5000];

  const deposit = async () => {
    setError("");
    const amt = Number(amount);
    if (!amt || amt <= 0) return setError("Please enter a valid amount.");
    if (amt < 10) return setError("Minimum deposit is ₹10.");
    setLoading(true);
    try {
      const res = await api.post("/users/deposit-money", { amount: amt });
      const url = res.data?.url;
      if (url) window.location.href = url;
      else throw new Error("No checkout URL received.");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">Add Money</div>
        <div className="modal-sub">You'll be redirected to Stripe's secure checkout</div>

        {error && <Alert>{error}</Alert>}

        <div className="form-group" style={{ marginBottom: 12 }}>
          <label className="form-label">Quick Select</label>
          <div className="amount-presets">
            {presets.map((p) => (
              <button
                key={p}
                className={`preset-btn ${amount == p ? "active" : ""}`}
                onClick={() => setAmount(p.toString())}
              >
                ₹{p}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Or Enter Amount (₹)</label>
          <input
            className="form-input"
            type="number"
            placeholder="e.g. 750"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="10"
          />
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="btn btn-accent btn-lg" style={{ flex: 1 }} onClick={deposit} disabled={loading}>
            {loading ? <><Spinner /> Redirecting...</> : `Pay ₹${amount || "0"} via Stripe →`}
          </button>
        </div>

        <div style={{ marginTop: 16, textAlign: "center", fontSize: "0.72rem", color: "var(--muted)" }}>
          🔒 Secured by Stripe · No card data stored on our servers
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard() {
  const { user, logout } = useAuth();
  const [showDeposit, setShowDeposit] = useState(false);
  const [walletLoading] = useState(false);

  // Parse balance from user object (balance may be stored on user model)
  const balance = parseFloat(user?.balance || 0).toFixed(2);
  const displayBalance = parseFloat(balance);

  return (
    <div className="app-shell">
      <nav className="nav">
        <div className="nav-logo">Trust<span>Split</span></div>
        <div className="nav-right">
          <div className="wallet-badge">
            <span className="wallet-dot" />
            Wallet Active
          </div>
          <div className="nav-user">@{user?.username}</div>
          <button className="btn btn-ghost" style={{ padding: "8px 16px", fontSize: "0.75rem" }} onClick={logout}>
            Sign Out
          </button>
        </div>
      </nav>

      <div className="dashboard">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: "0.78rem", color: "var(--muted)", marginBottom: 4 }}>
              Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"},
            </div>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "1.5rem" }}>
              {user?.fullname} 👋
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          {/* Balance Card */}
          <div className="balance-card">
            <div className="balance-label">Available Balance</div>
            {walletLoading ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--paper)" }}>
                <Spinner /> Loading wallet...
              </div>
            ) : (
              <div className="balance-amount">
                <span className="currency">₹</span>
                {displayBalance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </div>
            )}
            <div className="balance-locked">Locked in escrow: ₹0.00</div>
            <div className="balance-actions">
              <button className="btn btn-accent btn-lg" onClick={() => setShowDeposit(true)}>
                + Add Money
              </button>
              <button className="btn" style={{ background: "rgba(245,242,235,0.1)", color: "var(--paper)", borderColor: "rgba(245,242,235,0.2)" }}>
                ↗ Send
              </button>
              <button className="btn" style={{ background: "rgba(245,242,235,0.1)", color: "var(--paper)", borderColor: "rgba(245,242,235,0.2)" }}>
                ↙ Request
              </button>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="stat-card">
            <div className="stat-label">Account</div>
            <div className="stat-value" style={{ fontSize: "1.1rem", wordBreak: "break-all" }}>{user?.email}</div>
            <div className="stat-sub">@{user?.username}</div>
          </div>

          <div className="stat-card">
            <div className="stat-label">Wallet Type</div>
            <div className="stat-value">Personal</div>
            <div className="stat-sub">Standard user wallet</div>
          </div>

          {/* Recent Activity */}
          <div className="card" style={{ gridColumn: "1 / -1" }}>
            <div className="section-title">Recent Transactions</div>
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", padding: "40px 0", gap: 10
            }}>
              <div style={{ fontSize: "2rem" }}>📭</div>
              <div style={{ fontSize: "0.82rem", color: "var(--muted)" }}>No transactions yet</div>
              <button className="btn btn-ghost" style={{ marginTop: 8 }} onClick={() => setShowDeposit(true)}>
                Make your first deposit
              </button>
            </div>
          </div>
        </div>
      </div>

      {showDeposit && <DepositModal onClose={() => setShowDeposit(false)} />}
    </div>
  );
}

// ─── PAYMENT SUCCESS ──────────────────────────────────────────────────────────
function PaymentSuccess() {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (countdown <= 0) window.location.hash = "#dashboard";
  }, [countdown]);

  return (
    <div className="payment-page" style={{ background: "linear-gradient(135deg, #f0fdf4, var(--paper))" }}>
      <div className="payment-box">
        <span className="payment-icon">✅</span>
        <div className="payment-title" style={{ color: "#166534" }}>Payment Successful!</div>
        <div className="payment-msg">
          Your deposit is being processed. Your wallet balance will be updated
          shortly after our webhook confirms the payment.
        </div>
        <div className="card card-sm" style={{ marginBottom: 24, background: "#f0fdf4", borderColor: "#bbf7d0" }}>
          <div style={{ fontSize: "0.75rem", color: "#166534" }}>
            💡 Stripe has notified our server. Funds will appear in your wallet within a few seconds.
          </div>
        </div>
        <button className="btn btn-primary btn-lg btn-full" onClick={() => window.location.hash = "#dashboard"}>
          Back to Dashboard ({countdown}s)
        </button>
      </div>
    </div>
  );
}

// ─── PAYMENT CANCEL ───────────────────────────────────────────────────────────
function PaymentCancel() {
  return (
    <div className="payment-page">
      <div className="payment-box">
        <span className="payment-icon">❌</span>
        <div className="payment-title" style={{ color: "var(--error)" }}>Payment Cancelled</div>
        <div className="payment-msg">
          Your payment was not completed. No money has been deducted from your account.
        </div>
        <button className="btn btn-primary btn-lg btn-full" onClick={() => window.location.hash = "#dashboard"}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

// ─── AUTH WRAPPER ─────────────────────────────────────────────────────────────
function AuthWall() {
  const [page, setPage] = useState("login");
  return page === "login"
    ? <LoginPage onSwitch={() => setPage("register")} />
    : <RegisterPage onSwitch={() => setPage("login")} />;
}

// ─── ROUTER ───────────────────────────────────────────────────────────────────
function Router() {
  const { user } = useAuth();
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const handler = () => setHash(window.location.hash);
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  if (!user) {
    if (hash === "#payment-success") return <PaymentSuccess />;
    if (hash === "#payment-cancel") return <PaymentCancel />;
    return <AuthWall />;
  }

  if (hash === "#payment-success") return <PaymentSuccess />;
  if (hash === "#payment-cancel") return <PaymentCancel />;
  return <Dashboard />;
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  useEffect(() => { injectStyles(); }, []);

  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
