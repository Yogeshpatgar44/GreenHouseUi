import React, { useState } from "react";
import { Container, Box, Typography, Avatar, Button, TextField } from "@mui/material";
import { signOut, updateProfile } from "firebase/auth";
import { auth } from "../config/firebase";

const Profile = () => {
  const user = auth.currentUser;

  // State for edit mode and form fields
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [email] = useState(user?.email || ""); // Email is not editable
  const [loading, setLoading] = useState(false);

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Save changes to Firebase
  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(user, { displayName });
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    signOut(auth).catch((error) => console.error("Logout error:", error));
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundImage: `url('https://images.unsplash.com/photo-1723187137784-45f81b7253c3?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWdyaWN1bHR1cmUlMjBmaWVsZHxlbnwwfHwwfHx8MA%3D%3D')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        margin: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container
        maxWidth="sm"
        style={{
          padding: "20px",
          backgroundColor: "#ffffff",
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
            padding: "30px",
          }}
        >
          <Avatar sx={{ width: 100, height: 100, bgcolor: "#4caf50", fontSize: "40px" }}>
            {displayName?.[0]?.toUpperCase() || "U"}
          </Avatar>
          {isEditing ? (
            <TextField
              label="Name"
              variant="outlined"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              fullWidth
              sx={{ marginBottom: "10px" }}
            />
          ) : (
            <Typography variant="h5" style={{ fontWeight: "600", color: "#333" }}>
              {displayName || "User Name"}
            </Typography>
          )}

          <Typography variant="body1" style={{ color: "#777", fontSize: "16px" }}>
            {email}
          </Typography>

          {isEditing ? (
            <Box sx={{ display: "flex", gap: "10px" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={loading}
                sx={{ borderRadius: "8px" }}
              >
                {loading ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={toggleEditMode}
                sx={{ borderRadius: "8px" }}
              >
                Cancel
              </Button>
            </Box>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={toggleEditMode}
              sx={{ borderRadius: "8px", marginBottom: "10px" }}
            >
              Edit Profile
            </Button>
          )}

          <Button
            variant="outlined"
            color="secondary"
            onClick={handleLogout}
            sx={{ borderRadius: "8px" }}
          >
            Logout
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default Profile;
