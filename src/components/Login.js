import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: '',
    password: '',
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    const result = await login(data.email, data.password);
    if (result.success) {
      toast.success('SUCCESS LOGIN', { autoClose: 3000 });
      navigate('/');
    } else {
      toast.error(result.message || 'FAILED TO LOGIN');
    }
  };

  return (
    <Container
    maxWidth={false} // Ensures full width
    disableGutters // Removes default padding
    sx={{
      height: '100vh', // Full viewport height
      width: '100vw', // Full viewport width
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'url(https://miro.medium.com/v2/resize:fit:2000/format:webp/1*sH-R3a-xcH1n-O3AM36hEA.jpeg)', 
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
            backgroundImage: 'url(https://png.pngtree.com/thumb_back/fh260/background/20210902/pngtree-agricultural-science-and-technology-green-synthetic-plant-background-image_784022.jpg)', // Dynamic background
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        ></Box>

        {/* Right Side: Login Form */}
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
            Login
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
              onClick={handleLogin}
              sx={{ padding: '10px 0' }}
            >
              Login
            </Button>
          </Box>
          <Typography align="center" sx={{ marginTop: '20px' }}>
            Don’t have an account? <a href="/sign-up">Sign Up</a>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
