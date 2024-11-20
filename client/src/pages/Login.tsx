import { useRef } from "react";
import Button from "../dawn-ui/components/Button";
import Container from "../dawn-ui/components/Container";
import { axiosWrapper } from "../dawn-ui/util";
import { showInfoAlert } from "../dawn-ui/components/AlertManager";
import Navbar from "../dawn-ui/components/Navbar";
import Page from "../dawn-ui/components/Page";
import Row from "../dawn-ui/components/Row";
import Link from "../dawn-ui/components/Link";

export const baseUrl = "https://auth.dawn.rest";

export default function Login() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function startLogin() {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    if (!email || !password) return;

    try {
      await axiosWrapper(
        "post",
        `${baseUrl}/api/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      showInfoAlert("Succesfully logged in!");
      setTimeout(() => {
        let cb = new URLSearchParams(window.location.search).get("cb");
        if (cb) window.location.href = cb;
        else window.location.href = "/";
      }, 1000);
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
        <Container title="Login to dawn.rest">
          <div>
            <label>
              Login to your dawn.rest account.
              <br />
              Note: This feature is just a concept, it isn't meant to be taken
              seriously.
            </label>
            <table style={{ margin: "10px", borderSpacing: "10px" }}>
              <tbody>
                <tr>
                  <td>Email</td>
                  <td>
                    <input ref={emailRef} />
                  </td>
                </tr>
                <tr>
                  <td>Password</td>
                  <td>
                    <input ref={passwordRef} type="password" />
                  </td>
                </tr>
              </tbody>
            </table>
            <Button big onClick={startLogin}>
              Login
            </Button>
            <Link href={`${baseUrl}/register?cb=${window.location.href}`}>
              No Account?
            </Link>
          </div>
        </Container>
      </Page>
    </>
  );
}
