import React from "react";
import { Button } from "react-bootstrap";
import css from "./block-button.module.css";

export default function BlockButton(props) {
  return <Button {...props} className={css.block} />;
}
