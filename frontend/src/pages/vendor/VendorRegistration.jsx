import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setVendor } from "../../redux/VendorSlice";
import StepProgress from "./StepProgress";
import VendorAutoFillConfirmModal from "../../components/vendor/VendorAutoFillConfirmModal";
import Spinner from "./../../components/common/Spinner";
import axios from "axios";
import laptopBackground from "/vendorRegistration/laptop_background.webp";
import { Seo } from "../../seo/seo";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const EyeIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}><path d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/><path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/></svg>);
const EyeSlashIcon = () => (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" style={{width:16,height:16}}><path d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.243 4.243L6.228 6.228"/></svg>);

const VendorRegister = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const [isLoading, setIsLoading] = useState(false);
  const [showAutofillModal, setShowAutofillModal] = useState(false);
  const [hasAutofilled, setHasAutofilled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profilePicName, setProfilePicName] = useState("");
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", password: "", confirmPassword: "", profilePic: null });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setProfilePicName(files[0]?.name || "");
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const validateForm = () => {
    if (form.password !== form.confirmPassword) { setError("Passwords don't match!"); return false; }
    const emailRegex = /^[a-z][a-z0-9._%+-]*@[a-z0-9.-]+\.[a-z]{2,}$/;
    if (!emailRegex.test(form.email)) { setError("Invalid email! First letter must be lowercase."); return false; }
    const domain = form.email.split("@")[1];
    const typoDomains = ["gmal.com","gmial.com","gmai.com","gamil.com","gmil.com","gmaill.com","gmailc.om","gmail.con","gmail.cm","gmail.coom","gmail.comm","gmail.cmo","gmail.om","gmail.ocm","gmsil.com","gmaul.com","gmqil.com","gmakl.com","gmail.co","mail.com","gmal.co","gmal.con","gmal.cm"];
    if (typoDomains.includes(domain)) { setError("Email domain looks misspelled."); return false; }
    const bannedDomains = ["mailinator.com","tempmail.com","10minutemail.com","guerrillamail.com","throwawaymail.com"];
    if (bannedDomains.includes(domain)) { setError("Disposable email addresses are not allowed."); return false; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters!"); return false; }
    setError(""); return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setIsLoading(true); setError("");
    if (!validateForm()) { setIsLoading(false); return; }
    setLoading(true);
    try {
      if (form.confirmPassword !== form.password) { setError("Password not matching"); setLoading(false); setIsLoading(false); return; }
      const formData = new FormData();
      formData.append("fullName", form.fullName); formData.append("email", form.email);
      formData.append("phoneNumber", form.phone); formData.append("password", form.password);
      if (form.profilePic) formData.append("profilePicture", form.profilePic);
      const response = await axios.post(`${BACKEND_URL}/vendors/register`, formData, { headers: { "Content-Type": "multipart/form-data" }, withCredentials: true });
      dispatch(setVendor(response.data.data));
      const vendor = response.data.data;
      const fullName = vendor.fullName || "";
      const firstName = fullName.split(" ")[0];
      const firstLetter = firstName?.charAt(0).toUpperCase() || "";
      const profilePic = vendor.profilePic || "";
      localStorage.setItem("VendorCurrentlyLoggedIn", "true");
      localStorage.setItem("VendorFullName", fullName);
      localStorage.setItem("VendorFirstName", firstName);
      localStorage.setItem("VendorInitial", firstLetter);
      if (profilePic) localStorage.setItem("VendorProfilePic", profilePic);
      window.dispatchEvent(new Event("userLoggedIn"));
      navigate("/category/VendorService", { state: { currentStep: 1, vendorData: form, apiResponse: response.data } });
    } catch (error) {
      if (error.response?.data?.message) setError(error.response.data.message);
      else if (error.response?.status === 400) setError("Invalid data provided. Please check your inputs.");
      else if (error.response?.status === 409) setError("Email already exists. Please use a different email.");
      else setError("Registration failed. Please try again.");
    } finally { setLoading(false); setIsLoading(false); }
  };

  const handleAutofill = () => { setForm((prev) => ({ ...prev, fullName: user.fullName || "", email: user.email || "", phone: user.phoneNo || "" })); setHasAutofilled(true); setShowAutofillModal(false); };
  const handleDecline = () => { setShowAutofillModal(false); setHasAutofilled(true); };
  useEffect(() => { if (user && user.email && !hasAutofilled) setShowAutofillModal(true); }, [user, hasAutofilled]);

  const inputStyle = {
    width: "100%", height: 40, border: "1.5px solid #e2e8f0", borderRadius: 10,
    padding: "0 12px 0 12px", fontSize: 13, color: "#1e293b",
    background: "#f8fafc", outline: "none", fontFamily: "inherit",
    transition: "border-color 0.2s",
  };
  const labelStyle = { fontSize: 11.5, fontWeight: 600, color: "#374151", display: "flex", alignItems: "center", gap: 5, marginBottom: 5 };
  const fieldStyle = { display: "flex", flexDirection: "column", marginBottom: 12 };

  return (
    <>
      <Seo title={"Register as a Vendor"} description={"Register as a vendor on Eventsbridge."} />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .vr-root { font-family:'Plus Jakarta Sans',sans-serif; }
        .vr-input:focus { border-color:#f59e0b !important; box-shadow:0 0 0 3px rgba(245,158,11,0.12) !important; background:#fff !important; }
        .vr-submit:hover:not(:disabled) { opacity:0.92; transform:translateY(-1px); }
        .vr-submit:active:not(:disabled) { transform:translateY(0); }
        @media(max-width:700px){ .vr-right-panel{display:none!important;} .vr-two-col{grid-template-columns:1fr!important;} }
        @keyframes vr-fadein { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
        .vr-card { animation: vr-fadein 0.4s ease; }
      `}</style>

      {showAutofillModal && <VendorAutoFillConfirmModal onAccept={handleAutofill} onDecline={handleDecline} />}
      <StepProgress currentStep={0} />
      {isLoading && <Spinner />}

      <div className="vr-root" style={{ minHeight:"calc(100vh - 130px)", display:"flex", alignItems:"center", justifyContent:"center", padding:16, background:"linear-gradient(135deg, #060d1a 0%, #0b1a2e 50%, #0d1f38 100%)", position:"relative", overflow:"hidden" }}>
        {/* bg orbs */}
        <div style={{position:"absolute",top:-120,left:-80,width:420,height:420,borderRadius:"50%",background:"radial-gradient(circle,rgba(245,158,11,0.13) 0%,transparent 65%)",pointerEvents:"none"}} />
        <div style={{position:"absolute",bottom:-80,right:-80,width:380,height:380,borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,0.15) 0%,transparent 65%)",pointerEvents:"none"}} />
        <div style={{position:"absolute",inset:0,opacity:0.03,backgroundImage:"linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",backgroundSize:"48px 48px",pointerEvents:"none"}} />

        <div className="vr-card" style={{ position:"relative", zIndex:2, width:"100%", maxWidth:940, display:"flex", borderRadius:20, overflow:"hidden", boxShadow:"0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.06)" }}>

          {/* ── LEFT: Form ── */}
          <div style={{ flex:"1 1 0", padding:"34px 38px 28px", background:"rgba(255,255,255,0.98)", backdropFilter:"blur(20px)", display:"flex", flexDirection:"column" }}>
            
            {/* Header */}
            <div style={{ marginBottom:18 }}>
              <div style={{ fontSize:22, fontWeight:800, color:"#0b1a2e", letterSpacing:"-0.5px" }}>Create Vendor Account</div>
              <div style={{ fontSize:13, color:"#64748b", marginTop:3 }}>Welcome! Fill in the details below to get started.</div>
            </div>

            {/* Error */}
            {error && (
              <div style={{ display:"flex", alignItems:"flex-start", gap:10, background:"#fff1f2", border:"1px solid #fecdd3", borderRadius:10, padding:"10px 12px", marginBottom:14 }}>
                <div style={{ width:18, height:18, borderRadius:"50%", background:"#fee2e2", border:"1.5px solid #fca5a5", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:1, fontSize:10, fontWeight:700, color:"#ef4444" }}>!</div>
                <div style={{ fontSize:12.5, color:"#dc2626", lineHeight:1.5 }}>{error}</div>
              </div>
            )}

            {/* Row 1: Full Name + Phone */}
            <div className="vr-two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Full Name <span style={{color:"#ef4444"}}>*</span></label>
                <input className="vr-input" style={inputStyle} type="text" name="fullName" placeholder="Enter your full name" value={form.fullName} onChange={handleChange} required />
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Phone Number <span style={{color:"#ef4444"}}>*</span></label>
                <input className="vr-input" style={inputStyle} type="tel" name="phone" placeholder="Enter phone number" value={form.phone} onChange={handleChange} required />
              </div>
            </div>

            {/* Email */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Email Address <span style={{color:"#ef4444"}}>*</span></label>
              <input className="vr-input" style={inputStyle} type="email" name="email" placeholder="Enter your email address" value={form.email} onChange={handleChange} required />
            </div>

            {/* Row 2: Password + Confirm */}
            <div className="vr-two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
              <div style={fieldStyle}>
                <label style={labelStyle}>Password <span style={{color:"#ef4444"}}>*</span></label>
                <div style={{ position:"relative" }}>
                  <input className="vr-input" style={{...inputStyle, paddingRight:38}} type={showPassword?"text":"password"} name="password" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />
                  <button type="button" onClick={() => setShowPassword(p=>!p)} style={{ position:"absolute", right:11, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#94a3b8", display:"flex", alignItems:"center", padding:0 }}>
                    {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
              <div style={fieldStyle}>
                <label style={labelStyle}>Confirm Password <span style={{color:"#ef4444"}}>*</span></label>
                <div style={{ position:"relative" }}>
                  <input className="vr-input" style={{...inputStyle, paddingRight:38}} type={showPassword?"text":"password"} name="confirmPassword" placeholder="Re-enter password" value={form.confirmPassword} onChange={handleChange} required />
                  <button type="button" onClick={() => setShowPassword(p=>!p)} style={{ position:"absolute", right:11, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#94a3b8", display:"flex", alignItems:"center", padding:0 }}>
                    {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Pic */}
            <div style={fieldStyle}>
              <label style={labelStyle}>Profile Picture <span style={{fontWeight:400, color:"#94a3b8", fontSize:11}}>(Optional)</span></label>
              <label htmlFor="profilePicInput" style={{ display:"flex", alignItems:"center", gap:10, height:40, border:"1.5px dashed #cbd5e1", borderRadius:10, padding:"0 12px", background:"#f8fafc", cursor:"pointer" }}>
                <span style={{ fontSize:11.5, fontWeight:600, padding:"4px 10px", borderRadius:6, border:"1.5px solid #e2e8f0", background:"#fff", color:"#64748b", whiteSpace:"nowrap" }}>Choose File</span>
                <span style={{ fontSize:12, color:"#94a3b8" }}>{profilePicName || "No file chosen"}</span>
                <input id="profilePicInput" type="file" name="profilePic" accept="image/*" onChange={handleChange} style={{ display:"none" }} />
              </label>
            </div>

            {/* Submit */}
            <button className="vr-submit" onClick={handleSubmit} disabled={loading} style={{ width:"100%", height:44, marginTop:4, background:"linear-gradient(90deg, #f59e0b, #f97316)", border:"none", borderRadius:11, fontSize:14, fontWeight:700, color:"#0b1a2e", cursor:"pointer", letterSpacing:"0.2px", transition:"opacity 0.2s, transform 0.15s, box-shadow 0.2s", boxShadow:"0 4px 16px rgba(245,158,11,0.3)" }}>
              {loading ? "Registering..." : "Continue →"}
            </button>
            <div style={{ textAlign:"center", marginTop:10, fontSize:12.5, color:"#64748b" }}>Already registered? <a href="/vendor/login" style={{ color:"#f59e0b", fontWeight:600, textDecoration:"none" }}>Sign in</a></div>
          </div>

          {/* ── RIGHT: Brand Panel ── */}
          <div className="vr-right-panel" style={{ flex:"0 0 320px", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"40px 32px", textAlign:"center", background:"linear-gradient(155deg, #0d1b2e 0%, #0f2240 55%, #0d1b2e 100%)", position:"relative", overflow:"hidden" }}>
            <div style={{position:"absolute",top:-50,right:-50,width:240,height:240,borderRadius:"50%",background:"radial-gradient(circle,rgba(245,158,11,0.22) 0%,transparent 68%)",pointerEvents:"none"}} />
            <div style={{position:"absolute",bottom:-30,left:-40,width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,rgba(99,102,241,0.2) 0%,transparent 65%)",pointerEvents:"none"}} />
            
            <div style={{ width:52, height:52, borderRadius:14, background:"linear-gradient(135deg,#f59e0b,#f97316)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, fontWeight:800, color:"#0b1a2e", boxShadow:"0 8px 24px rgba(245,158,11,0.4)", marginBottom:18, position:"relative", zIndex:1 }}>E</div>
            
            <div style={{ fontSize:30, fontWeight:800, letterSpacing:"-0.8px", marginBottom:8, background:"linear-gradient(90deg,#f9c823,#ff930f,#ffd166)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text", position:"relative", zIndex:1 }}>Register Here</div>
            
            <div style={{ width:48, height:3, borderRadius:2, background:"linear-gradient(90deg,#f59e0b,#f97316)", margin:"0 auto 16px", position:"relative", zIndex:1 }} />
            
            <p style={{ fontSize:13.5, color:"rgba(255,255,255,0.65)", lineHeight:1.7, maxWidth:220, margin:"0 auto 24px", position:"relative", zIndex:1 }}>
              Join <span style={{color:"#f9c823", fontWeight:600}}>EventsBridge</span> — your one-stop platform for discovering trusted vendors, planning events, and creating unforgettable experiences.
            </p>
            
            <div style={{ display:"flex", flexDirection:"column", gap:8, width:"100%", maxWidth:200, position:"relative", zIndex:1 }}>
              {[["🎉","Event Planning"],["🤝","Trusted Vendors"],["⚡","Fast & Easy"]].map(([icon, text]) => (
                <div key={text} style={{ display:"flex", alignItems:"center", gap:10, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, padding:"9px 14px" }}>
                  <div style={{ width:28, height:28, borderRadius:8, background:"rgba(245,158,11,0.15)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14 }}>{icon}</div>
                  <div style={{ fontSize:12.5, fontWeight:600, color:"rgba(255,230,120,0.9)" }}>{text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function App() { return <VendorRegister />; }
