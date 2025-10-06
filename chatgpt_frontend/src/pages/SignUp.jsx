import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/signup/", {
        username,
        password,
      });
      navigate("/login");
    } catch (err) {
      alert("Signup failed");
    }
  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h4 className="mb-3 text-center">Signup</h4>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Username"
            className="form-control mb-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="form-control mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn btn-primary w-100 mb-2" type="submit">
            Signup
          </button>
        </form>

        <div className="text-center">
          <p className="mb-1">Already have an account?</p>
          <button
            className="btn btn-outline-secondary w-100"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
