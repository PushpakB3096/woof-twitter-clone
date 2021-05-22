import React, { MutableRefObject, useRef, useState } from "react"
import { gql, useMutation, useQuery } from '@apollo/client'
import { ErrorMessage, Field, Form, Formik } from 'formik';
import Modal from 'react-modal'

import { ME_QUERY } from '../pages/Profile';
import { customStyles } from '../styles/customModalStyles';

export const UPDATE_PROFILE_MUTATION = gql`
    mutation updateProfile(
        $bio: String
        $location: String
        $website: String
        $avatar: String
    ) {
        updateProfile(
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


const UpdateProfile = () => {
  const { loading, error, data } = useQuery(ME_QUERY);

  // image handling below
  const inputFile = useRef() as MutableRefObject<HTMLInputElement>;
  const [image, setImage] = useState("");
  const [imageLoading, setImageLoading] = useState(false);

  // refetchQuery is for running a query again and re-rendering the DOM
  const [updateProfile] = useMutation(UPDATE_PROFILE_MUTATION, {
    refetchQueries: [{
      query: ME_QUERY
    }]
  });

  // determines our modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) return <p>Loading...</p>
  if (error) return <p>{error.message}</p>

  Modal.setAppElement('#root');

  // setting initial form values from the current logged in profile
  const initialValues: ProfileValues = {
    bio: data.currentProfile.bio,
    location: data.currentProfile.location,
    website: data.currentProfile.website,
    avatar: data.currentProfile.avatar
  }

  // functions to change modal open and close states
  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  // function that will handle image uploads
  const uploadImage = async (e: any) => {
    const files = e.target.files;
    const data = new FormData();

    data.append('file', files[0]);
    // name of the preset from Cloudinary
    data.append('upload_preset', 'r1ygficv');

    // loading for image
    setImageLoading(true);

    const res = await fetch(`${process.env.REACT_APP_IMAGE_ENDPOINT}`, {
      method: "POST",
      body: data
    });

    const file = await res.json();

    setImage(file.secure_url);

    setImageLoading(false);
  }

  return (
    <div>
      <button onClick={openModal} className="edit-button">Edit Profile</button>
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="Modal" style={customStyles}>
        {/* hidden input for files */}
        <input type="file" name="file" onChange={uploadImage} ref={inputFile} style={{ display: "none" }} />
        {imageLoading ? (
          <h3>Loading...</h3>
        ) : (
          <>
            {image ? (
              <span onClick={() => inputFile.current.click()}>
                <img
                  src={image}
                  style={{ width: "150px", borderRadius: "50%" }}
                  alt="avatar" />
              </span>

            ) : (
              <span onClick={() => inputFile.current.click()}>
                <i className="fa fa-user fa-5x" aria-hidden="true"></i>
              </span>
            )}
          </>
        )}
        <Formik
          initialValues={initialValues}
          // validationSchema={validationSchema}
          onSubmit={async (values: any, { setSubmitting }) => {
            setSubmitting(true);

            await updateProfile({
              variables: { ...values, avatar: image }
            });

            setSubmitting(false);
            // close modal after submitting
            setIsModalOpen(false);
          }}
        >
          <Form>
            <Field name="bio" type="text" as="textarea" placeholder="Enter your bio" />
            <ErrorMessage name="bio" component={"div"} />
            <Field name="location" type="text" placeholder="Enter your location" />
            <ErrorMessage name="location" component={"div"} />
            <Field name="website" type="text" placeholder="Enter your website" />
            <ErrorMessage name="website" component={"div"} />
            {/* TODO: avatar */}

            {/* submit button */}
            <button type="submit" className="login-button">
              <span>Update Profile</span>
            </button>
          </Form>
        </Formik>
      </Modal>
    </div >
  )
}

export default UpdateProfile
