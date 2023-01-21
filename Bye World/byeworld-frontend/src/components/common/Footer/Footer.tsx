import { Box, Icon, Link, Typography } from "@mui/material";

export default function Footer() {
  return (
    <footer className="p-4 bg-white shadow md:px-6 md:py-8 dark:bg-gray-900">
      <div className="sm:flex sm:items-center sm:justify-between">
        <Box sx={{ display: { xs: "none", md: "flex" }, flexGrow: 0 }}>
          <Link href="/">
            <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <Icon className="material-symbols-outlined text-white">code</Icon>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  mr: 2,
                  flexGrow: 1,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "white",
                  textDecoration: "none",
                }}
              >
                BYEWORLD
              </Typography>
            </Box>
          </Link>
        </Box>
      </div>
      <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
      <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
        © 2022{" "}
        <Link href="/" className="hover:underline">
          ByeWorld
        </Link>
        . All Rights Reserved.
      </span>
    </footer>
  );
}
