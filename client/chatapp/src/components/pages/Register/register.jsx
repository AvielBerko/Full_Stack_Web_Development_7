import Input from "../../common/Input/input";
import BlockButton from "../../common/BlockButton/block-button";
import { useState } from "react";
import { Col, Container, Row, Alert } from "react-bootstrap";
import { useSession } from "../../../custom-hooks/use-session";
import { useNavigate } from "react-router-dom";
import register from "../../../api/register";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [alert, setAlert] = useState("");

  const navigate = useNavigate();

  const [_, setAuth] = useSession("auth", null);

  /**
   * Validates the form.
   * @returns {string} An error message if the form is invalid, or an empty string if the form is valid.
   */
  const validateForm = () => {
    // Add your validation logic here
    const englishRegex = /^[A-Za-z0-9\s]+$/;
    const userNameMaxLength = 16;

    if (!email) {
      return "Email is required.";
    }

    if (!password) {
      return "Password is required.";
    }

    if (!passwordConfirm) {
      return "Confirm Password is required.";
    }

    if (password !== passwordConfirm) {
      return "Password and Confirm Password must match.";
    }

    if (!username) {
      return "Username is required.";
    }

    if (username.length > userNameMaxLength) {
      return "Username cannot exceed 16 characters.";
    }

    if (!englishRegex.test(username)) {
      return "Username can only contain English letters and numbers.";
    }

    return ""; // Empty string indicates the form is valid
  };

  const handleRegister = () => {
    const errorMessage = validateForm();
    if (errorMessage) {
      setAlert(errorMessage);
    } else {
      const newUser = {
        username,
        password,
        email,
        phone_number: phoneNumber,
      };
      register(newUser).then((res) => {
        setAuth(res);
        navigate(`/${user.username}/profile`, { replace: true });
      }).catch((error) => setAlert(error.message));;
    }
  };

  const closeAlert = () => {
    setAlert("");
  };

  const alertDOM = (
    <Row className="text-center">
      <Col>
        <Alert variant={alert ? "danger" : ""} onClose={() => setAlert("")}>
          {alert}
        </Alert>
      </Col>
    </Row>
  );

  return (
    <>
    { alertDOM }
    <div className="auth-wrapper">
    <div className="auth-inner">
      <div>
        <h3>Register</h3>
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
          <label>Confirm Password</label>
          <Input
            inputType="password"
            className="form-control"
            placeholder="Confirm your password"
            value={passwordConfirm}
            setter={setPasswordConfirm}
          />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <Input
            inputType="text"
            className="form-control"
            placeholder="Enter email"
            value={email}
            setter={setEmail}
          />
        </div>
        <div className="mb-3">
          <label>Phone Number</label>
          <Input
            inputType="text"
            className="form-control"
            placeholder="Enter phone number"
            value={phoneNumber}
            setter={setPhoneNumber}
          />
        </div>
        <div className="d-grid">
          <button onClick={handleRegister} className="btn btn-primary">
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>
  </>
  );
}
