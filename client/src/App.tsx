import React from "react";
import Navbar from "./dawn-ui/components/Navbar";
import Row from "./dawn-ui/components/Row";
import Page from "./dawn-ui/components/Page";
import Container from "./dawn-ui/components/Container";
import Button from "./dawn-ui/components/Button";

export default function App() {
  return (
    <>
      <Navbar title="Dawn Account" breadcrumb>
        <Row>
          <></>
        </Row>
      </Navbar>
      <Page>
        <Container title="Welcome">
          <p>Welcome to Dawn Accounts.</p>
          <Row>
            <Button big onClick={() => (window.location.href = "/register")}>
              Register
            </Button>
            <Button big onClick={() => (window.location.href = "/login")}>
              Login
            </Button>
          </Row>
        </Container>
      </Page>
    </>
  );
}
