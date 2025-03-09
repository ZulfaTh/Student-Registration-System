import React, { useState, useEffect, Fragment } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { Button, Typography, Box } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/CheckCircle";


const EmailVerify = () => {
  const [validUrl, setValidUrl] = useState(true);
  const param = useParams();
  
  useEffect(() => {
    const verifyEmailUrl = async () => {
      try {
        const url = `http://localhost:8080/api/users/${param.id}/verify/${param.token}`;
        const { data } = await axios.get(url);
        console.log(data);
        setValidUrl(true);
      } catch (error) {
        console.log(error);
        setValidUrl(false);
      }
    };
    verifyEmailUrl();
  }, [param]);

  return (
    <Fragment>
      {validUrl ? (
        <Box
          sx={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 2,
            }}
          >
            <VerifiedIcon sx={{ color: "#3bb19b", fontSize: 60 }} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 2 }}>
            Email Verified Successfully
          </Typography>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              color="success"
              sx={{
                padding: "12px 0",
                borderRadius: "20px",
                width: 180,
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Login
            </Button>
          </Link>
        </Box>
      ) : (
        <Box
          sx={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: "bold", color: "red" }}>
            404 Not Found
          </Typography>
        </Box>
      )}
    </Fragment>
  );
};

export default EmailVerify;
