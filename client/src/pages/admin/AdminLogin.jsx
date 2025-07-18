import { useInputValidation } from '6pp';
import { Button, Container, Paper, TextField, Typography } from '@mui/material';
import React from 'react'
import { Navigate } from 'react-router-dom';

const AdminLogin = () => {

    const secretKey=useInputValidation("");
    const isAdmin=true;


    if(isAdmin===true){
        return <Navigate to={"/admin/dashboard"}/>
    }
    const handleSubmit=(e)=>{
        e.preventDefault();

        console.log("sbmitted");
    }
  return (
    <Container
      component={"main"}
      maxWidth="xs"
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        
            <Typography variant="h5">Admin Login</Typography>

            <form
              style={{
                width: "100%",
                marginTop: "1rem",
              }}

              onSubmit={handleSubmit}
            >
              
              <TextField
                id=""
                label="Secret Key"
                type="password"
                value={secretKey.value}
                onChange={secretKey.changeHandler}
                required
                fullWidth
                margin="normal"
                variant="outlined"
              />

              <Button
                variant="contained"
                color="primary"
                type="submit"
                fullWidth
              >
                Login
              </Button>

              
            </form>
            </Paper>

            </Container>
  )
}
            

export default AdminLogin;