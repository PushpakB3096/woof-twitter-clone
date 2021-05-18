import React from "react";
import { useHistory } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";

// all custom types go here
// types for all input values
interface SignupValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// gql mutation to register a user
const SIGNUP_MUTATION = gql`
  mutation signup($name: String, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      token
    }
  }
`;
const Signup = () => {
  const history = useHistory();
  const [signup, { data }] = useMutation(SIGNUP_MUTATION);

  // initial values of the form
  const initialValues: SignupValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  // validations for all fields go here
  const validationSchema = Yup.object({
    // name must have max of 25 characters
    name: Yup.string()
      .max(25, "Must be 25 characters or less")
      .required("Name Required"),

    // email is a string with email type and is mandatory
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),

    // password must be 15 characters max
    password: Yup.string()
      .max(15, "Must be 15 characters or less")
      .required("Password Required"),

    // both the passwords should be same
    confirmPassword: Yup.string().oneOf(
      [Yup.ref("password")],
      "Passwords must match"
    ),
  });

  return (
    <div>
      <h1>Signup</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values: any, { setSubmitting }) => {
          setSubmitting(true);

          const resp = await signup({
            variables: values,
          });

          localStorage.setItem("token", resp.data.signup.token);
          setSubmitting(false);
          history.push("/users");
        }}
      >
        <Form>
          <Field name="email" type="email" placeholder="Enter your email" />
          <ErrorMessage name="email" component={"div"} />
          <Field name="name" type="text" placeholder="Enter your name" />
          <ErrorMessage name="name" component={"div"} />
          <Field
            name="password"
            type="password"
            placeholder="Enter your password"
          />
          <ErrorMessage name="password" component={"div"} />
          <Field
            name="confirmPassword"
            type="password"
            placeholder="Enter your password again"
          />
          <ErrorMessage name="confirmPassword" component={"div"} />
          <button type="submit">Signup</button>
        </Form>
      </Formik>
    </div>
  );
};

export default Signup;
