import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ContactsList from "./child-components/contacts-list";
import { useState } from "react";
import { SortBy as SortMethod } from "./types";

export default function Contacts() {
  const [sortBy, setSortBy] = useState("id");

  const handleSortOptionChange = (event) => {
    setSortBy(event.target.value);
  };

  return (
    <Container>
      <Row className="text-center">
        <Col>
          <h1>Contacts</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <div className="d-flex flex-row gap-2">
            <label>Sort By</label>
            <select
              title="sort options"
              value={sortBy}
              onChange={handleSortOptionChange}
            >
              {Object.keys(SortMethod).map((key) => (
                <option
                  key={key}
                  value={SortMethod[key]}
                >
                  {key}
                </option>
              ))}
            </select>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <ContactsList sortBy={sortBy} />
        </Col>
      </Row>
    </Container>
  );
}
