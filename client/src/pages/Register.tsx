import { useRef } from "react";
import Button from "../dawn-ui/components/Button";
import Container from "../dawn-ui/components/Container";
import { axiosWrapper } from "../dawn-ui/util";
import { showInfoAlert } from "../dawn-ui/components/AlertManager";
import Navbar from "../dawn-ui/components/Navbar";
import Page from "../dawn-ui/components/Page";
import Row from "../dawn-ui/components/Row";
import { baseUrl } from "./Login";

export default function Register() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function startRegister() {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    if (!email || !password) return;

    try {
      await axiosWrapper(
        "post",
        `${baseUrl}/api/register`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );
      showInfoAlert("Succesfully created your account!");
      setTimeout(() => {
        let cb = new URLSearchParams(window.location.search).get("cb");
        if (cb) window.location.href = cb;
        else window.location.href = "/login";
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
        <Container title="Register to dawn.rest">
          <div>
            <label>Create a new Dawn account.</label>
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
            <Button big onClick={startRegister}>
              Register
            </Button>
          </div>
        </Container>
      </Page>
    </>
  );
}
