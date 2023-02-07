import React from "react";
import { Button, Container, Row } from "react-bootstrap";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <>
      <div>
        <Container>
          <Row>
            <div className="intro-text">
              <div>
                <h1 className="title">Welcome to NotePal</h1>
              </div>
            </div>
          </Row>
        </Container>
      </div>
      <div className="main"></div>
    </>
  );
};

export default LandingPage;
