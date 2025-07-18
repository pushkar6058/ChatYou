import React from 'react'
import {DataGrid} from "@mui/x-data-grid";
import  {Container, Paper, Typography } from '@mui/material';

const Table = ({rows,columns,heading,rowHeight=52}) => {
  return (

    <Container sx={{
      height:"100vh",

    }}>

      <Paper elevation={3} sx={{
        height:"100%",
        padding:"1rem 4rem",
        borderRadius:"1rem",
        margin:"auto",
        width:"100%",
        overflow:"hidden",
        boxShadow:"none"
        }}>
        <Typography textAlign={"center"}
        variant='h4'
        sx={{
          margin:"2rem",
          textTransform:"uppercase",
        }}

        >
            {heading}
        </Typography>
        <DataGrid rows={rows} rowHeight={rowHeight} columns={columns}
        style={{
          height:"80%",

        }}
        
        sx={{
          border:"none",
          ".table-header": {
            backgroundColor: "black",
            color:"white"
          },
        }}
        />
      </Paper>
        
        </Container>
  )
}

export default Table