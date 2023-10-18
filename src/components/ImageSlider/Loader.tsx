import { Box, LinearProgress, Typography } from "@mui/material";

const Loader = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Typography variant="body2" gutterBottom>Loading image list</Typography>
    <Box sx={{ width: '50%', maxWidth: '10rem' }}>
      <LinearProgress />
    </Box>

  </Box>
);

export default Loader;
