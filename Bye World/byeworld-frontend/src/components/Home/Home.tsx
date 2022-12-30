import { Stack } from "@mui/material";
import { Box } from "@mui/system";

export const Home: React.FC = () => {
  return (
    <>
      <Stack>
        <Box>Largest database of jobs</Box>
        <Box>
          <header className="App-header">
            <p className="text-4xl underline animate-ping">Milan Stojkovic</p>
          </header>
        </Box>
      </Stack>
    </>
  );
};
