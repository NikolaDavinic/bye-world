import { Box, Icon, Link, Typography } from '@mui/material'
import React from 'react'

export default function Footer() {
    return (

        <footer className="p-4 bg-white shadow md:px-6 md:py-8 dark:bg-gray-900">
            <div className="sm:flex sm:items-center sm:justify-between">
                {/* <a href="#" className="flex items-center mb-4 sm:mb-0">
                    <img src="https://flowbite.com/docs/images/logo.svg" className="h-8 mr-3" alt="Flowbite Logo" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Flowbite</span>
                </a> */}
                <Box sx={{ display: { xs: "none", md: "flex" }, flexGrow: 0 }}>
                    <Link href="/">
                        <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <Icon className="material-symbols-outlined text-white">code</Icon>
                            <Typography
                                variant="h6"
                                noWrap
                                component="a"
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
                <ul className="flex flex-wrap items-center mb-6 text-sm text-gray-500 sm:mb-0 dark:text-gray-400">
                    <li>
                        <a href="#" className="mr-4 hover:underline md:mr-6 ">About</a>
                    </li>
                    <li>
                        <a href="#" className="mr-4 hover:underline md:mr-6">Privacy Policy</a>
                    </li>
                    <li>
                        <a href="#" className="mr-4 hover:underline md:mr-6 ">Licensing</a>
                    </li>
                    <li>
                        <a href="#" className="hover:underline">Contact</a>
                    </li>
                </ul>
            </div>
            <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
            <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2022 <Link href="/" className="hover:underline">ByeWorld</Link>. All Rights Reserved.
            </span>
        </footer>

    )
}
