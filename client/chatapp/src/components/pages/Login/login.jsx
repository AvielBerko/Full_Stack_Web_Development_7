import Input from "../../common/Input/input";
import React, { useState } from "react";
import { Col, Row, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useSession } from "../../../custom-hooks/use-session";
import login from "../../../api/login";
// import LoginComponent from "./child-components/login-component";
import "../../../css/login.css"; // Import custom CSS for styling

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState("");
  const [_, setAuth] = useSession("auth", false);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!username) setAlert("Please enter a username.");
    else if (!password) setAlert("Please enter a password.");
    else
      login(username, password)
        .then((user) => {
          console.log(user);
          if (user) {
            setAuth(user);
            navigate("/direct_messages", { replace: true });
          } else {
            setAlert("Something went wrong... Please try again later.");
          }
        })
        .catch((error) => {
          setAlert(error.message);
        });
  };

  const alertDOM = (
    <Row className="text-center">
      <Col>
        <Alert variant={alert ? "danger" : ""} onAbort={() => setAlert("")}>
          {alert}
        </Alert>
      </Col>
    </Row>
  );

  return (
    <>
    <div className="rapper">
      {alertDOM}
      <div className="auth-wrapper">
        <div className="auth-inner">
          <div>
            <h3>Login</h3>
            <div className="mb-3">
              <label>Username</label>
              <Input
                inputType="text"
                className="form-control"
                placeholder="Enter username"
                value={username}
                setter={setUsername}
              />
            </div>
            <div className="mb-3">
              <label>Password</label>
              <Input
                inputType="password"
                className="form-control"
                placeholder="Enter password"
                value={password}
                setter={setPassword}
              />
            </div>
            <div className="mb-3">
              <div className="custom-control custom-checkbox d-flex gap-1">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="customCheck1"
                />
                <label className="custom-control-label" htmlFor="customCheck1">
                 Remember me
                </label>
              </div>
            </div>
            <div className="d-grid">
              <button onClick={handleLogin} className="btn btn-primary">
                Submit
              </button>
            </div>
            <p className="forgot-password text-right">
              <a href="#">Forgot password?</a>
            </p>
          </div>
        </div>
      </div>
    </div>
      {/* <LoginComponent onLogin={handleLogin}/> */}
    </>
  );
}
