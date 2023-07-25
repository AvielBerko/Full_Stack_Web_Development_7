import { Form, InputGroup } from "react-bootstrap";
import { StateSetter } from "../../types/react.types";
import { ComponentType } from "react";

type EdibaleLabelProps = {
  label: string;
  value: string;
  setter: StateSetter<string>;
  isEditable: Boolean;
  WrapperComponent?: ComponentType<Partial<{ children: any }>>;
};

export default function EdibaleLabel({
  label,
  value,
  setter,
  isEditable,
  WrapperComponent,
}: EdibaleLabelProps) {
  if (isEditable) {
    return (
      <InputGroup>
        <InputGroup.Text>{label}</InputGroup.Text>
        <Form.Control
          type="text"
          value={value}
          onChange={(e) => setter(e.target.value)}
        ></Form.Control>
      </InputGroup>
    );
  }

  if (!WrapperComponent) {
    return (
      <p>
        {label}: {value}
      </p>
    );
  }

  return (
    <WrapperComponent>
      {label}: {value}
    </WrapperComponent>
  );
}
