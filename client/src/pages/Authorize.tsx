import { useEffect, useState } from "react";
import Container from "../dawn-ui/components/Container";
import { showErrorAlert } from "../dawn-ui/components/AlertManager";
import { axiosWrapper } from "../dawn-ui/util";
import Loader from "react-spinners/PulseLoader";
import Row from "../dawn-ui/components/Row";
import Button from "../dawn-ui/components/Button";
import Page from "../dawn-ui/components/Page";
import Navbar from "../dawn-ui/components/Navbar";
import { baseUrl } from "./Login";

export default function Authorize() {
  const [ready, setReady] = useState<boolean>(false);

  useEffect(() => {
    const url = window.location;
    const query = new URLSearchParams(url.search);

    if (!query.has("cb")) {
      showErrorAlert(`Authorization failed: no cb search param was provided.`);
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
      return;
    }

    (async () => {
      try {
        await axiosWrapper("get", `${baseUrl}/api/get`, {
          withCredentials: true,
        });
        setReady(true);
      } catch {
        window.location.href = `/login?cb=${encodeURI(
          window.location.toString()
        )}`;
      }
    })();
  }, []);

  async function authorize() {
    try {
      const result = await axiosWrapper(
        "post",
        `${baseUrl}/api/access-token`,
        {},
        { withCredentials: true }
      );
      const token = result.data["access-token"];
      const cb = new URLSearchParams(window.location.search.toString()).get(
        "cb"
      );
      window.location.href = `${cb}?access-token=${token}`;
    } catch {}
  }

  return (
    <>
      <Navbar title="dawn.rest" breadcrumb>
        <Row>
          <></>
        </Row>
      </Navbar>
      <Page>
        {!ready ? (
          <Loader color="white" />
        ) : (
          <Container title="Authorize [app]">
            Are you sure you would like to login to [app] with your dawn.rest
            account?
            <Row>
              <Button big>No</Button>
              <Button onClick={authorize} big>
                Yes
              </Button>
            </Row>
          </Container>
        )}
      </Page>
    </>
  );
}
