import { Button, Chip, Icon, Link } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Listing } from '../../model/Listing'
import { ListingCard } from '../common/ListingsList/ListingCard'
import { SimilarListingCard } from './SimilarListingCard'
import { useNavigate, useParams } from 'react-router-dom'
import { useApi } from '../../hooks/api.hook'
import axios from 'axios'
import { ListingDTO } from '../listings/ListingsPage'
import { api } from '../../constants'
import { Company } from '../../model/Company'
import parse from 'html-react-parser';
import { Skill } from '../../model/Skill'

const ListingPage: React.FC = () => {
    const navigate = useNavigate()
    const params = useParams()
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // const [similarListings, setSimilarListings] = useState<Array<Listing> | null>([])
    const [listing, setListing] = useState()
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

    const {
        result: listing1,
    } = useApi<any>(`/listing/${params.id}`);

    // const getListing = async () =>{
    //     const response = await api.get("/listing/" + params.id);
    //     setListing(await response.data)
    //     console.log(listing)
    // }

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
    } = useApi<ListingDTO[]>(`/listing/similarlistings/${params.id}`);

    useEffect(() => {
        // checkUserToken()
        // getListingForPage()
        // getListing()
        // console.log(listing)
        // console.log(isLoggedIn)
    }, [])

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
                                            <span className='font-bold text-xl'>{listing1?.title}</span>
                                        </h1>
                                        <h4>
                                            <Link href={`/company/${listing1?.company.id}`} className='print:text-black print:no-underline link font-semibold'>{listing1?.company.name}</Link>
                                        </h4>
                                    </div>
                                    <div className='grid gap-1 pr-4 md:pr-0'>
                                        <div className='flex items-center gap-1'>
                                            <div className='flex items-center gap-1'>
                                                <Icon className="material-symbols-outlined">
                                                    location_city
                                                </Icon>
                                                <p className='text-sm font-semibold'>{listing1?.city?.name}</p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-1'>
                                            <i className='print:hidden las la-clock text-lg leading-none'></i>
                                            <p className='text-sm font-semibold flex items-center'>
                                                {/* {console.log(listing1?.closingDate)} */}
                                                <Icon className="material-symbols-outlined">schedule</Icon>
                                                {new Date(listing1?.closingDate).toLocaleDateString("de-DE")}
                                            </p>
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
                                        {listing1?.skill != null && listing1?.skill?.map((r: any) => {
                                            return <Chip key={r.id} label={r.name} color="primary" />;
                                        })}
                                    </div>
                                    <div className='print:justify-start print:mx-0 flex items-center justify-center md:mr-24 mt-4 md:mt-8 mb-4 mx-auto md:m-auto order-first md:order-last'>
                                        <a className='hover:opacity-75 bg-white p-2 rounded-md' href='#'>
                                            <img
                                                alt=""
                                                className="w-40 h-40"
                                                src={
                                                    (listing1?.company?.logoUrl && listing1?.company?.logoUrl.length >= 0) ? listing1?.company?.logoUrl :
                                                        "https://www.adaptivewfs.com/wp-content/uploads/2020/07/logo-placeholder-image.png"
                                                }
                                                onClick={() => navigate(`/company/${listing1?.company?.id}/about`)}
                                            />
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className='bg-white border-t-2 '>
                                <div className='flex flex-col justify-start '>
                                    {/* <div className='print:bg-transparent print:text-black print:brorder-none prose p-4 md:p-8 inline-block'>
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
                                    </ul> */}
                                    {listing1?.description && <div>{parse(listing1?.description)}</div>}

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
                        {listings != null && listings?.map(listing => {
                            // console.log(listing);
                            return (
                                <div key={listing?.id}>
                                    <Link href={`/listing/${listing?.id}`}>
                                        <SimilarListingCard listing={listing} divHeight={300} divMaxWidth={400} divMinWidth={350} />
                                    </Link>
                                </div>
                            )
                        })}

                    </div>

                </div>
            </div>
        </main>
    )
}

export default ListingPage;