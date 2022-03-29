import React from "react";
import { Box } from "@mui/material";

const Home: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
      }}
    >
      <Box
        sx={{
          flex: 1,
        }}
      >
        First One
      </Box>
      <Box>Second One</Box>
    </Box>
  );
};

export default Home;
