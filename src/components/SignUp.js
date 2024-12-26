import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../config/firebase';
import { setDoc, doc, collection } from 'firebase/firestore';
import { toast } from 'react-toastify';

const SignUp = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    authID: '',
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const createUser = async () => {
    try {
      const response = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      // console.log(response);
      

      // Update state with UID
      setData((prevData) => ({
        ...prevData,
        authID: response.user.uid,
      }));

      return true;
    } catch (error) {
      console.error('Error creating user:', error.message);
      toast.error('Failed to create user in Firebase Auth');
      return false;
    }
  };

  const setUserInFirestore = async () => {
    try {
      // Save the user data to Firestore
      const collRef = collection(db, 'users');
      const docRef = doc(collRef); // Automatically generate a document ID
      await setDoc(docRef, data); // Save the entire updated data object
      return true;
    } catch (error) {
      console.error('Error saving user to Firestore:', error.message);
      toast.error('Failed to save user in Firestore');
      return false;
    }
  };

  const handleSignUp = async () => {
    try {
      if (await createUser()) {
        if (await setUserInFirestore()) {
          toast.success('Sign Up Success', { autoClose: 1000 });
          navigate('/login'); // Redirect to login
        }
      }
    } catch (error) {
      console.error('Sign Up Error:', error.message);
      toast.error('An unexpected error occurred during sign up');
    }
  };

  return (
    <Container
      maxWidth={false} // Ensures full width
      disableGutters
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage:
          'url(https://miro.medium.com/v2/resize:fit:2000/format:webp/1*sH-R3a-xcH1n-O3AM36hEA.jpeg)', // Background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          backgroundColor: 'rgba(255, 255, 255, 0.9)', // Semi-transparent background
          borderRadius: '10px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden',
          width: { xs: '100%', sm: '80%', md: '70%' },
          maxWidth: '900px',
        }}
      >
        {/* Left Side: Background Image */}
        <Box
          sx={{
            flex: 1,
            display: { xs: 'none', md: 'block' },
            backgroundImage:
              'url(https://png.pngtree.com/thumb_back/fh260/background/20210902/pngtree-agricultural-science-and-technology-green-synthetic-plant-background-image_784022.jpg)', // Dynamic background
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></Box>

        {/* Right Side: Sign Up Form */}
        <Box
          sx={{
            flex: 1,
            padding: '30px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" align="center" gutterBottom>
            Sign Up
          </Typography>
          <Box
            sx={{
              width: '100%',
              maxWidth: '400px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <TextField
              label="Name"
              variant="outlined"
              name="name"
              fullWidth
              onChange={handleFormChange}
            />
            <TextField
              label="Email"
              variant="outlined"
              name="email"
              fullWidth
              onChange={handleFormChange}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              name="password"
              fullWidth
              onChange={handleFormChange}
            />
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleSignUp}
              sx={{ padding: '10px 0' }}
            >
              Sign Up
            </Button>
          </Box>
          <Typography align="center" sx={{ marginTop: '20px' }}>
            Already have an account? <a href="/login">Login</a>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default SignUp;
