import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Form } from "react-bootstrap";
import Loading from "../../components/Loading";
import MainScreen from "../../components/MainScreen";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const params = useParams();

  const handleSubmit = async (e) => {
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
    } else if (password !== confirmPassword) {
      toast.error("Password and Confirm Password do not match", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    } else {
      setLoading(true);
      try {
        const response = await axios.post(
          `http://localhost:5320/api/users/reset-password/${params.resetToken}`,
          { password }
        );
        setMessage(response.data.msg);
      } catch (error) {
        setMessage("Invalid Reset Token");
      } finally {
        setLoading(false);
        navigate("/login");
        toast.success("Password Reset Successfully", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 1000,
        });
      }
    }
  };

  return (
    <MainScreen className="title" title="Enter your new password">
      <div className="loginContainer">
        {/* {error && <ErrorMessage variant='danger'>{error}</ErrorMessage>} */}
        {loading && <Loading />}
        <Form className="formStyles" onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label className="shkrimi">New Password</Form.Label>
            <Form.Control
              className="register_form"
              required
              type="password"
              placeholder="*********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
            <Form.Label className="shkrimi">Confirm Password</Form.Label>
            <Form.Control
              className="register_form"
              required
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
              placeholder="*********"
            />
          </Form.Group>

          <button className="loginButton" type="submit">
            Enter your new password
          </button>
        </Form>
      </div>
    </MainScreen>
  );
};

export default ResetPassword;
