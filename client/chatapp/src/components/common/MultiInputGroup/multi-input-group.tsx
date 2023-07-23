import { InputGroup, Form } from "react-bootstrap";
import { StateSetter } from "../../../src/types/react.types";

type InputItemProps = {
  setter: StateSetter<any>;
  placeholder: string;
  propName: string;
  obj: any;
};

export type InputItem = {
  placeholder: string;
  propName: string;
};

type MultiInputGroupProps = {
  setter: StateSetter<any>;
  obj: any;
  items: InputItem[];
  label: string;
};

function InputItem({ setter, placeholder, propName, obj }: InputItemProps) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setter((prev: any) => ({ ...prev, [propName]: e.target.value }));
  };

  return (
    <Form.Control
      type="text"
      placeholder={placeholder}
      onChange={onChange}
      value={obj[propName]}
    />
  );
}

export default function MultiInputGroup({
  setter,
  items,
  label,
  obj,
}: MultiInputGroupProps) {
  return (
    <InputGroup>
      <InputGroup.Text>{label}</InputGroup.Text>
      {items.map((item) => (
        <InputItem
          key={item.propName}
          setter={setter}
          placeholder={item.placeholder}
          propName={item.propName}
          obj={obj}
        />
      ))}
    </InputGroup>
  );
}
