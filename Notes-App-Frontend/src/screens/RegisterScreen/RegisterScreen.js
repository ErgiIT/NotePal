import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Row, Col } from "react-bootstrap";
//import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
import MainScreen from "../../components/MainScreen";
import "./RegisterScreen.css";
import { toast } from "react-toastify";
import "./../../toastifyCustomStyles.css";

const RegisterScreen = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  //const baseUrl = "https://notes-app-backend.cyclic.app/";
  const baseUrl = "http://localhost:5320/";

  const registerHandler = async (e) => {
    e.preventDefault();

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must be at least 8 characters long with at least 1 capital letter, 1 number and a special character",
        {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        }
      );
    } else if (password !== confirmpassword) {
      toast.error("Password and Confirm Password do not match", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    } else {
      setMessage(null);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };

        setLoading(true);
        const { data } = await axios.post(
          `${baseUrl}register`,
          {
            name,
            email,
            password,
          },
          config
        );

        // console.log(data);
        setLoading(false);

        toast.success("Register Successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 300,
        });

        toast.success("Please Login", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });

        navigate("/login");
      } catch (error) {
        setLoading(false);
        toast.error(error.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
        setError(error.response.data.message);
      }
    }
  };

  return (
    <MainScreen title="Create your account">
      <div className="registerContainer">
        {/* {message && <ErrorMessage variant='danger'>{message}</ErrorMessage>} */}
        {/* {error && <ErrorMessage variant='danger'>{error}</ErrorMessage>} */}
        {loading && <Loading></Loading>}

        <Form onSubmit={registerHandler} className="formStyles">
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label className="shkrimi">Name</Form.Label>
            <Form.Control
              className="register_form"
              required
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder="Ram"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label className="shkrimi">Email address</Form.Label>
            <Form.Control
              className="register_form"
              required
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="abc@example.com"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label className="shkrimi">Password</Form.Label>
            <Form.Control
              className="register_form"
              required
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              placeholder="*********"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
            <Form.Label className="shkrimi">Confirm Password</Form.Label>
            <Form.Control
              className="register_form"
              required
              type="password"
              value={confirmpassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              placeholder="*********"
            />
          </Form.Group>

          <button type="submit" className="registerButton">
            Register
          </button>
        </Form>

        <Row className="py-3">
          <Col className="registerCol">
            Already have an account?
            <span>
              <Link to="/login" className="cool_transformation">
                {" "}
                Login Here
              </Link>
            </span>
          </Col>
        </Row>
      </div>
    </MainScreen>
  );
};

export default RegisterScreen;
