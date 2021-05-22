import { useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Modal from 'react-modal'

import { ME_QUERY } from '../pages/Profile';
import { customStyles } from '../styles/customModalStyles';

export const CREATE_PROFILE_MUTATION = gql`
    mutation createProfile(
        $bio: String
        $location: String
        $website: String
        $avatar: String
    ) {
        createProfile(
            bio: $bio
            location: $location
            website: $website
            avatar: $avatar
        ) {
            id
        }
    }

`

// types for profile args 
interface ProfileValues {
  bio: string
  location: string
  website: string
  avatar: string
}


const CreateProfile = () => {

  // refetchQuery is for running a query again and re-rendering the DOM
  const [createProfile] = useMutation(CREATE_PROFILE_MUTATION, {
    refetchQueries: [{
      query: ME_QUERY
    }]
  });

  // determines our modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // setting initial form values
  const initialValues: ProfileValues = {
    bio: "",
    location: "",
    website: "",
    avatar: "",
  }

  // functions to change modal open and close states
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <div>
      <button onClick={openModal}>Create Profile</button>
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Modal" style={customStyles}>
        <Formik
          initialValues={initialValues}
          // validationSchema={validationSchema}
          onSubmit={async (values: any, { setSubmitting }) => {
            setSubmitting(true);

            await createProfile({
              variables: values,
            });

            setSubmitting(false);
          }}
        >
          <Form>
            <Field name="bio" type="text" as="textArea" placeholder="Enter your bio" />
            <ErrorMessage name="bio" component={"div"} />
            <Field name="location" type="text" placeholder="Enter your location" />
            <ErrorMessage name="location" component={"div"} />
            <Field name="website" type="text" placeholder="Enter your website" />
            <ErrorMessage name="website" component={"div"} />
            {/* TODO: avatar */}

            {/* submit button */}
            <button type="submit" className="login-button">
              <span>Create Profile</span>
            </button>
          </Form>
        </Formik>
      </Modal>
    </div>
  )
}

export default CreateProfile
