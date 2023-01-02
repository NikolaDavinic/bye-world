import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea, Icon } from '@mui/material';
import { Company } from '../../../model/Company';
import { Listing } from '../../../model/Listing';
import { useNavigate } from 'react-router-dom';
interface ListingCardProps {
    listing: Listing
}
export const ListingCard: React.FC<ListingCardProps> = ({
    listing
}: ListingCardProps) => {
    const navigate = useNavigate();

    return (
        <Card sx={{ maxWidth: 1200, width:"auto", minWidth:1000 , height: 250 }}>
            <CardActionArea className='h-full' onClick={() => navigate("/listing/" + listing.ID)}>
                <CardContent className='h-full'>
                    <div className='flex flex-row justify-between h-full'>
                        <div className='flex flex-col gap-4 px-4 md:pl-4 mb-4 w-2/3'>
                            <div className="grid gap-1">
                                <div className="flex items-center gap-1 w-1/2 overflow-hidden">
                                    <p className='hover:opacity-50 font-bold text-lg'>
                                        {listing!.Title}
                                    </p>
                                </div>
                            </div>
                            <div className="grid gap-1">
                                <div className="flex items-center gap-1 w-1/2 overflow-hidden">
                                    <p className='font-semibold opacity-75'>
                                        <a href='/'>
                                            {/* Naziv komapnije */}
                                            Company
                                        </a>
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-1">
                                <div className="flex items-center gap-1 w-1/2 overflow-hidden">
                                    <p className="text-sm opacity-90">
                                        {listing!.Description}
                                    </p>
                                </div>
                            </div>
                            <div className="grid gap-1">
                                <div className="flex items-center gap-1">
                                    <div className="flex items-center gap-1">
                                        <Icon
                                            className="material-symbols-outlined"
                                        >
                                            location_city
                                        </Icon>
                                        <p className="text-sm font-semibold">Beograd</p>
                                    </div>

                                </div>

                                <div className="flex items-center gap-1">
                                    <Icon
                                        className="material-symbols-outlined"
                                    >
                                        schedule
                                    </Icon>
                                    <p className="text-sm font-semibold">{listing.ClosingDate.toLocaleDateString("de-DE")}</p>
                                </div>
                            </div>
                            {/* TODO: Replace with Material UI chip */}
                            {/*TODO: Map required skills below and fix tag navigation */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <a href="/oglasi-za-posao/crm" className="bg-main text-white rounded-md btn btn-xs btn-primary w-auto">
                                    Java
                                </a>
                                <button type="button" className="w-auto bg-main text-white rounded-md cursor-pointer" >
                                    <span className='text-white'>Senior </span>
                                </button>
                            </div>
                        </div>
                        <div className='w-1/5 flex flex-col justify-center align-middle'>
                            <img className='w-40 h-40' src={listing.Company?.LogoUrl ?? "https://www.adaptivewfs.com/wp-content/uploads/2020/07/logo-placeholder-image.png"} onClick={() => navigate("/company/" + listing.Company?.ID)} />
                        </div>
                    </div>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}
