import { Card, CardActionArea, CardContent } from '@mui/material'
import React, { Component } from 'react'
import PeopleIcon from '@mui/icons-material/People';
import { Link, useNavigate } from 'react-router-dom'
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import HomeWorkIcon from '@mui/icons-material/HomeWork';

interface HomeCardProps {
    name: string
    count: number | null
    icon: number
    link: string
}

const HomeCard: React.FC<HomeCardProps> = ({
    name, count, icon, link
}: HomeCardProps) => {
    const navigate = useNavigate()
    return (
        <Link to={`/${link}`}>
            <div className='w-[160px] h-[160px] relative bg-white rounded-lg shadow-md flex flex-col items-center justify-center
            gap-4 hover:opacity-75 hover:transition-all hover:scale-110 p-6 border border-gray-100 shadow-lg shadow-neutral-100'>
                {/* <Card sx={{ maxWidth: 1200, width: "auto", minWidth: 1000, height: 250 }}> */}
                {/* <CardActionArea */}
                {/* className="h-full hover:bg-blue-100"> */}
                {/* <CardContent className="h-full"> */}
                {icon == 1 && <i className="las la-laptop-code text-blue-600 text-3xl"><PeopleIcon /></i>
                }
                {icon == 2 && <i className="las la-laptop-code text-blue-600 text-3xl"><BookmarksIcon /></i>
                }
                {icon == 3 && <i className="las la-laptop-code text-blue-600 text-3xl"><HomeWorkIcon /></i>
                }
                <div className='space-y-1'>
                    <p className='font-semibold text-center text-lg'>{name}</p>
                    <p className='font-medium opacity-50 text-center'>{count != null ? count : 0}</p>
                </div>
                {/* </CardContent> */}
                {/* </CardActionArea> */}
                {/* </Card> */}
            </div>
        </Link>
    )
}

export default HomeCard