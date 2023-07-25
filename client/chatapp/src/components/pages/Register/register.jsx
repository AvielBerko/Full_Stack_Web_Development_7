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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    const englishRegex = /^[A-Za-z0-9\s]+$/;
    const phoneNumberRegex = /^\d{10}$/;
    const userNameMaxLength = 16;

    if (!email) {
      return "Email is required.";
    }

    // if (!emailRegex.test(email)) {
    //   return "Email is not valid.";
    // }

    if (!password) {
      return "Password is required.";
    }

    // if (!passwordRegex.test(password)) {
    //   return "Password must contain a letter, a number, a special character, and be between 6 and 16 characters long.";
    // }

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

    // if (!phoneNumberRegex.test(phoneNumber)) {
    //     return "Phone number must be 10 digits long.";
    // }

    return ""; // Empty string indicates the form is valid
  };

  const onSubmit = () => {
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
        setAuth(newUser); // TODO change to res.token
        navigate("/home", { replace: true });
      }).catch((error) => setAlert(error.message));;
    }
  };

  const closeAlert = () => {
    setAlert("");
  };

  const alertDOM = (
    <Row>
      <Col>
        <Alert variant="danger" onClose={closeAlert} dismissible>
          {alert}
        </Alert>
      </Col>
    </Row>
  );

  return (
    <Container>
      <Row className="text-center">
        <Col>
          <h1>Register</h1>
        </Col>
      </Row>
      {alert != "" && alertDOM}
      <Row>
        <Col>
          <Input placeholder="Username" value={username} setter={setUsername} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Input
            placeholder="Password"
            inputType="password"
            value={password}
            setter={setPassword}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Input
            inputType="password"
            placeholder="Confirm Password"
            value={passwordConfirm}
            setter={setPasswordConfirm}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Input placeholder="Email" value={email} setter={setEmail} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Input
            placeholder="Phone Number"
            value={phoneNumber}
            setter={setPhoneNumber}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <BlockButton variant="success" onClick={onSubmit}>
            Register
          </BlockButton>
        </Col>
      </Row>
    </Container>
  );
}
