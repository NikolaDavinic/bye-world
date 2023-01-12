import { Button, Chip, Link } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Listing } from '../../model/Listing'
import { ListingCard } from '../common/ListingsList/ListingCard'
import { SimilarListingCard } from './SimilarListingCard'
import { useNavigate, useParams } from 'react-router-dom'
import { useApi } from '../../hooks/api.hook'
import axios from 'axios'

const ListingPage: React.FC = () => {
    const navigate = useNavigate()
    const params = useParams()
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // const [similarListings, setSimilarListings] = useState<Array<Listing> | null>([])
    const [listing, setListing] = useState<Listing | null>()
    const checkUserToken = () => {
        const userToken = localStorage.getItem('user')
        if (!userToken || userToken === "undefined") {
            setIsLoggedIn(false);
        }
        setIsLoggedIn(true)
    }

    // const getSimilarListings(){
    //     const proba = {
    //         id:63,
    //         city: "Nis",
    //         companyName: "Nignite"
    //     }

    //     api.get.
    // }

    // const {
    //     result: listing,
    //     loading,
    //     error,
    //   } = useApi<Listing>(`/listing/`);

    // const getListingForPage = async () => {
    //     const response = await axios.get(`/listing/${params.id}`)
    //     .then(r => {
    //         setListing(r.data);
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })

    // }

    const {
        result: listings,
        loading,
        error,
      } = useApi<Listing[]>(`/listing/similarlistings/63/Nis/Nignite`);

    useEffect(() => {
        checkUserToken()
        // getListingForPage()
        console.log(listing)
        console.log(isLoggedIn)
    }, [isLoggedIn])

    const testListing: Listing = {
        id: 1,
        closingDate: new Date(Date.now()),
        description: "Ovo je primer opisa posla",
        postingDate: new Date(Date.now()),
        requirements: [],
        title: "Java Senior Developer",
        city: undefined,
        company: undefined
    }
    const testListings: Array<Listing> = [
        {
            id: 1,
            closingDate: new Date(Date.now()),
            description: "Ovo je primer opisa posla1",
            postingDate: new Date(Date.now()),
            requirements: [],
            title: "C# Senior Developer",
            city: undefined,
            company: undefined
        },
        {
            id: 2,
            closingDate: new Date(Date.now()),
            description: "Ovo je primer opisa posla2",
            postingDate: new Date(Date.now()),
            requirements: [],
            title: "Java Senior Developer",
            city: undefined,
            company: undefined
        },
        {
            id: 3,
            closingDate: new Date(Date.now()),
            description: "Ovo je primer opisa posla3",
            postingDate: new Date(Date.now()),
            requirements: [],
            title: "Python Senior Developer",
            city: undefined,
            company: undefined
        }
    ]

    return (
        <main className="flex-1">
            <div className="relative max-w-7xl mx-auto md:flex md:gap-6 px-4 py-8">

                <div className="grid gap-4 w-full">
                    <div className='print:shadow-none relative shadow-md rounded-lg mb-6 -mx-4 md:mx-auto md:w-full'>
                        <div className='print:bg-transparent print:text-black print:border-none top-0 relative bg-white rounded-t-lg border-b md:z-10'>


                            <div className='flex flex-col md:flex:row border-t-2'>
                                <div className='grid gap-4 flex-1 pt-4 md:pt-8 md:pl-8 pl-4 md:mb-8 mb-4'>
                                    <div>
                                        <h1>
                                            <span className='font-bold text-xl'>.NET Winter Workshop</span>
                                        </h1>
                                        <h4>
                                            <Link href='/company/1' className='print:text-black print:no-underline link font-semibold'>Levi9 Technology Services</Link>
                                        </h4>
                                    </div>
                                    <div className='grid gap-1 pr-4 md:pr-0'>
                                        <div className='flex items-center gap-1'>
                                            <div className='flex items-center gap-1'>
                                                <i className='print:hidden las la-map-marker text-lg leading-none'></i>
                                                <p className='text-sm font-semibold'>Zrenjanin</p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-1'>
                                            <i className='print:hidden las la-clock text-lg leading-none'></i>
                                            <p className='text-sm font-semibold'>25.01.2023</p>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-2 flex-wrap'>
                                        {/* <span className='tag lowercase w-auto print:bg-transparent print:text-black print:p-0 tag-xs tag-primary'>
                                            <span>.NET</span>
                                        </span>
                                        <span className='tag lowercase w-auto print:bg-transparent print:text-black print:p-0 tag-xs tag-primary'>
                                            <span>C#</span>
                                        </span>
                                        <span className='tag lowercase w-auto print:bg-transparent print:text-black print:p-0 tag-xs tag-primary'>
                                            <span>CSS</span>
                                        </span>
                                        <span className='tag lowercase w-auto print:bg-transparent print:text-black print:p-0 tag-xs tag-primary'>
                                            <span>Java</span>
                                        </span> */}
                                        {["Java", "Senior"].map((r: String, i) => {
                                            return <Chip key={i} label={r} color="primary" />;
                                        })}
                                    </div>
                                    <div className='print:justify-start print:mx-0 flex items-center justify-center md:mr-24 mt-4 md:mt-8 mb-4 mx-auto md:m-auto order-first md:order-last'>
                                        <a className='hover:opacity-75 bg-white p-2 rounded-md' href='#'>
                                            <img className='object-contain h-[120px] w-[120px]' src='../../../public/logo512.png' alt='Levi9 Technology Services'></img>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className='bg-white border-t-2 '>
                                <div className='flex flex-col justify-start '>
                                    <div className='print:bg-transparent print:text-black print:brorder-none prose p-4 md:p-8 inline-block'>
                                        <h3><strong>Do you want to spend cold days with a great team from Zrenjanin and gain new knowledge and skills?</strong></h3>
                                    </div><p>Our .NET Winter Workshops are giving you the blended learning approach - theory, video materials, and solving tasks with the mentors.</p>
                                    <p>Start: <strong>1st March 2023.<br /></strong>Duration: <strong>6 weeks<br /></strong>Location: <strong>Hybrid (Zrenjanin office + online)</strong></p>
                                    <h3 className='font-bold mb-15 text-lg self-start ml-5 gap-5'>What do we offer?</h3>
                                    <ul className='self-start ml-10 break-all inline-block list-disc gap-5'>
                                        <li>Programming in cutting edge technologies - development of modern web applications</li>
                                        <li>Introduction to agile framework for software development - Scrum training</li>
                                        <li>Introduction to Microsoft Azure, OOP design principles, Relational databases</li>
                                    </ul>
                                    <h3 className='font-bold mb-15 text-lg self-start ml-5 mt-15'>What are we looking for?</h3>
                                    <ul className='self-start ml-10 break-all inline-block list-disc'>
                                        <li>Basic knowledge of one of the programming languages (C#, Java, Python...)</li>
                                        <li>Basic knowledge of web technologies (HTML, CSS, optional JS)</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="print:hidden sticky bottom-0 bg-white rounded-b-lg flex flex-col md:flex-row items-center justify-center  
                                    border-t p-4">

                            <div className="flex flex-col w-full md:w-auto gap-1">
                                <p className='font-semibold text-red-600'>If you want to participate, all you have to do is to fill out the form and send your CV.</p>

                                <Button variant="contained">Apply Here</Button>
                                {!isLoggedIn && <p className='text-3xl text-red-800 font-semibold'>You must be signed in</p>}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div className='bg-gray-200'>
                <div className='grid gap-4 max-w-7xl mx-auto px-4 py-8'>
                    <p className='font-nold text-xl'>Similar listings</p>
                    <div className='grid md:grid-cols-3 gap-4'>
                        {listings?.map(listing => {
                            console.log(listing);
                            return (
                                <SimilarListingCard listing={listing} divHeight={300} divMaxWidth={400} divMinWidth={350} />
                            )
                        })}

                    </div>

                </div>
            </div>
        </main>
    )
}

export default ListingPage;