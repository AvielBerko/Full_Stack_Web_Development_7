import React from "react";
import { Row, Col, Alert } from "react-bootstrap";

const AlertComponent = ({ alert, setAlert }) => {
  return (
    <Row>
      <Col>
        <Alert variant="danger" onClose={() => setAlert("")} dismissible>
          {alert}
        </Alert>
      </Col>
    </Row>
  );
};

export default AlertComponent;
