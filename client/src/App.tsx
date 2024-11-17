import React from "react";
import Navbar from "./dawn-ui/components/Navbar";
import Row from "./dawn-ui/components/Row";
import Page from "./dawn-ui/components/Page";
import Container from "./dawn-ui/components/Container";

export default function App() {
  return (
    <>
      <Navbar title="Template dawn-ui app" breadcrumb>
        <Row>""</Row>
      </Navbar>
      <Page>
        <Container title="Hey!">
          <p>Welcome to the template dawn-ui project.</p>
        </Container>
      </Page>
    </>
  );
}
