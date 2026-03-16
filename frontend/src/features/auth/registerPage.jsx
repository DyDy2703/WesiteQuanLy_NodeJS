import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterPage.css";
import LoginPage from "./loginPage";

function RegisterPage() {

  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    display_name: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const nextStep = (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
        alert("Vui lòng điền đầy đủ thông tin");
        return;
    }
    if (formData.password !== formData.confirmPassword) {
        alert("Mật khẩu không trùng khớp");
        return;
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (formData.display_name) {

      console.log(formData);

      alert("Register success!");

      navigate("/login");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">

        { step === 1 && (
        <form onSubmit={nextStep}>
        
        <h2 className="register-title">Create your new account</h2>
          <div className="input-group">
            <label>User name</label>
            <input
              type="text"
              placeholder="Enter your name"
              value={formData.username}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Create password"
              value={formData.password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Confirm Password</label>
            <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
            />
          </div>

          <button className="register-button">Sign up</button>

            <p className="register-footer">
                Already have an account? <a href="/login">Login</a>
            </p>
        </form>
    )} 


    {step === 2 && (
          <form onSubmit={nextStep}>

            <h2>Set display name</h2>

            <input
              name="display_name"
              placeholder="Display name"
              value={formData.display_name}
              onChange={handleChange}
            />

            <button>Create account</button>

          </form>
        )}
        </div>
    </div>
    );
}

export default RegisterPage;