import { Form, InputGroup } from "react-bootstrap";
import { StateSetter } from "../../../src/types/react.types";

type InputProps = Partial<{
  inputType: string;
  placeholder: string;
  value: string;
  setter: StateSetter<string>;
}>;

export default function Input({
  inputType,
  placeholder,
  value,
  setter,
}: InputProps) {

  const setText = (e: React.ChangeEvent<HTMLInputElement>) => {
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
