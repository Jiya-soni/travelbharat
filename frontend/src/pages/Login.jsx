import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  // Which form is showing: "signin" or "register"
  const [activeTab, setActiveTab] = useState("signin");

  // Sign In form fields
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");

  // Register form fields
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirm, setRegisterConfirm] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // Whether each password field is currently showing as plain text
  const [showSigninPassword, setShowSigninPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showRegisterConfirm, setShowRegisterConfirm] = useState(false);

  // ---- REAL sign-in logic ----
  async function handleLogin() {
    setIsLoading(true);
    try {
      const response = await fetch("https://travelbharat-1irh.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signinEmail, password: signinPassword }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("loggedInUser", JSON.stringify(data.user));
        navigate("/explore");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Couldn't connect to the server. Is it running?");
    }
    setIsLoading(false);
  }

  // ---- REAL register logic ----
  async function handleRegister() {
    if (registerPassword !== registerConfirm) {
      alert("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("https://travelbharat-1irh.onrender.com/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: registerName,
          email: registerEmail,
          password: registerPassword,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        alert("Account created! You can now sign in.");
        setActiveTab("signin");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Couldn't connect to the server. Is it running?");
    }
    setIsLoading(false);
  }

  return (
    <div style={styles.body}>
      <div style={styles.loginBox}>

        {/* LEFT SIDE */}
        <div style={styles.leftSide}>
          <div>
            <div style={styles.smallLabel}>TravelBharat</div>
            <h1 style={styles.heading}>
              One key to<br />
              <span style={styles.headingAccent}>every state</span><br />
              of India.
            </h1>
          </div>
          <div>
            <div style={styles.dottedLine}></div>
            <p style={styles.leftParagraph}>
              Sign in once, then explore heritage, nature, and pilgrim trails
              from Kashmir to Kanyakumari — no need to log in again.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div style={styles.rightSide}>

          {/* Tabs */}
          <div style={styles.tabButtons}>
            <button
              onClick={() => setActiveTab("signin")}
              style={activeTab === "signin" ? styles.tabActive : styles.tab}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("register")}
              style={activeTab === "register" ? styles.tabActive : styles.tab}
            >
              Register
            </button>
          </div>

          {/* Sign In form - only shows when activeTab is "signin" */}
          {activeTab === "signin" && (
            <div style={styles.formBox}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  style={styles.input}
                  value={signinEmail}
                  onChange={(e) => setSigninEmail(e.target.value)}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.passwordWrap}>
                  <input
                    type={showSigninPassword ? "text" : "password"}
                    placeholder="••••••••"
                    style={styles.input}
                    value={signinPassword}
                    onChange={(e) => setSigninPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    style={styles.eyeButton}
                    onClick={() => setShowSigninPassword(!showSigninPassword)}
                  >
                    {showSigninPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>
              <button style={styles.mainButton} onClick={handleLogin} disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In →"}
              </button>
            </div>
          )}

          {/* Register form - only shows when activeTab is "register" */}
          {activeTab === "register" && (
            <div style={styles.formBox}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  placeholder="Aarav Sharma"
                  style={styles.input}
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  style={styles.input}
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                />
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Password</label>
                <div style={styles.passwordWrap}>
                  <input
                    type={showRegisterPassword ? "text" : "password"}
                    placeholder="••••••••"
                    style={styles.input}
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    style={styles.eyeButton}
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                  >
                    {showRegisterPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Confirm Password</label>
                <div style={styles.passwordWrap}>
                  <input
                    type={showRegisterConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    style={styles.input}
                    value={registerConfirm}
                    onChange={(e) => setRegisterConfirm(e.target.value)}
                  />
                  <button
                    type="button"
                    style={styles.eyeButton}
                    onClick={() => setShowRegisterConfirm(!showRegisterConfirm)}
                  >
                    {showRegisterConfirm ? "🙈" : "👁"}
                  </button>
                </div>
              </div>
              <button style={styles.mainButton} onClick={handleRegister} disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account →"}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Plain JavaScript objects holding our styles.
// (Later we can move this to a proper CSS file - this is just
// the quickest way to get something on screen first.)
const styles = {
  body: {
    fontFamily: "'Work Sans', sans-serif",
    backgroundColor: "#121D33",
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
  },
  loginBox: {
    display: "flex",
    width: "100%",
    maxWidth: "900px",
    minHeight: "550px",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 50px 100px -20px rgba(0,0,0,0.55)",
  },
  leftSide: {
    background: "linear-gradient(155deg, #1B2A45 0%, #121D33 100%)",
    color: "#FBF6EC",
    flex: 1,
    padding: "50px 40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  smallLabel: {
    fontSize: "12px",
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: "#E0913C",
    fontWeight: 600,
    marginBottom: "16px",
  },
  heading: {
    fontFamily: "'Fraunces', serif",
    fontSize: "40px",
    fontWeight: 600,
    lineHeight: 1.22,
  },
  headingAccent: {
    color: "#E0913C",
    fontStyle: "italic",
  },
  dottedLine: {
    borderTop: "1px dashed rgba(255,255,255,0.35)",
    margin: "20px 0",
  },
  leftParagraph: {
    fontSize: "13px",
    lineHeight: 1.6,
    color: "#E9E4D8",
    maxWidth: "260px",
  },
  rightSide: {
    backgroundColor: "#FBF6EC",
    flex: 1.1,
    padding: "50px 45px",
    display: "flex",
    flexDirection: "column",
  },
  tabButtons: {
    display: "flex",
    gap: "25px",
    borderBottom: "1px solid #DFD5BE",
    marginBottom: "30px",
  },
  tab: {
    background: "none",
    border: "none",
    fontSize: "14px",
    fontWeight: 600,
    color: "#756C57",
    paddingBottom: "12px",
    cursor: "pointer",
  },
  tabActive: {
    background: "none",
    border: "none",
    fontSize: "14px",
    fontWeight: 600,
    color: "#2A2418",
    paddingBottom: "12px",
    borderBottom: "2px solid #E0913C",
    cursor: "pointer",
  },
  formBox: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "#756C57",
    fontWeight: 600,
  },
  input: {
    border: "1.5px solid #DFD5BE",
    borderRadius: "12px",
    padding: "13px 14px",
    fontSize: "15px",
    fontFamily: "'Work Sans', sans-serif",
    backgroundColor: "#FFFFFF",
    color: "#2A2418",
    width: "100%",
  },
  passwordWrap: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  eyeButton: {
    position: "absolute",
    right: "14px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "15px",
    opacity: 0.55,
    padding: 0,
  },
  mainButton: {
    marginTop: "10px",
    backgroundColor: "#1B2A45",
    color: "#FBF6EC",
    border: "none",
    borderRadius: "30px",
    padding: "15px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
  },
};

export default Login;