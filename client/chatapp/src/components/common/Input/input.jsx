import React from "react";
import { Form, InputGroup } from "react-bootstrap";

export default function Input({
  inputType,
  placeholder,
  value,
  setter,
}) {

  const setText = (e) => {
    if(!setter){
      return;
    }
    setter(e.target.value);
  }

  return (
    <InputGroup>
      <Form.Control
        type={inputType ?? "text"}
        as={inputType === "textarea" ? "textarea" : "input"}
        placeholder={placeholder ?? ""}
        value={value ?? ""}
        onChange={setText}
      />
    </InputGroup>
  );
}
