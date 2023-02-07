import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Form } from "react-bootstrap";
import MainScreen from "../../components/MainScreen";
import Loading from "../../components/Loading";

const EmailInput = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5320/api/users/reset-password",
        {
          email,
        }
      );
      setMessage(response.data.success);
      toast.success("Email Sent Successfully", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    } catch (error) {
      setMessage("User does't exist");
    }
    setLoading(false);
  };

  return (
    <MainScreen className="title" title="Enter your details">
      <div className="loginContainer">
        {/* {error && <ErrorMessage variant='danger'>{error}</ErrorMessage>} */}
        {loading && <Loading />}
        <Form className="formStyles" onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label className="shkrimi">Email address</Form.Label>
            <Form.Control
              className="register_form"
              required
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <button className="loginButton" type="submit">
            Enter your email
          </button>
        </Form>
      </div>
    </MainScreen>
  );
};

export default EmailInput;
