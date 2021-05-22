import React from "react";
import { Link, useHistory } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

import WoofLogo from "../styles/assets/woof-logo.png";
import "../styles/login.css"

// all custom types go here
// types for all input values
interface LoginValues {
  email: string;
  password: string;
}

// gql mutation to register a user
const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;
const Login = () => {
  const history = useHistory();
  const [login, { data }] = useMutation(LOGIN_MUTATION);

  // initial values of the form
  const initialValues: LoginValues = {
    email: "",
    password: "",
  };

  // validations for all fields go here
  const validationSchema = Yup.object({
    // email is a string with email type and is mandatory
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),

    // password must be 15 characters max
    password: Yup.string()
      .max(15, "Must be 15 characters or less")
      .required("Password Required"),
  });

  return (
    <div className="container">
      <img
        src={WoofLogo}
        alt="WoofLogo"
        style={{ width: "50px" }}
        className="logo"
      />
      <h3>Login to Woof!</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values: any, { setSubmitting }) => {
          setSubmitting(true);

          const resp = await login({
            variables: values,
          });

          // setting the token obtained from the mutation in the localStorage
          localStorage.setItem("token", resp.data.login.token);
          setSubmitting(false);

          // redirecting user back to home after successful login
          history.push("/users");
        }}
      >
        <Form>
          <Field name="email" type="email" placeholder="Enter your email" />
          <ErrorMessage name="email" component={"div"} />
          <Field
            name="password"
            type="password"
            placeholder="Enter your password"
          />
          <ErrorMessage name="password" component={"div"} />
          {/* submit button */}
          <button type="submit" className="login-button">
            <span>Login</span>
          </button>
        </Form>
      </Formik>

      {/* footer */}
      <div className="register">
        <h4>Don't have an account yet?</h4>
        <Link to="/signup">Signup here!</Link>
      </div>
    </div>
  );
};

export default Login;
