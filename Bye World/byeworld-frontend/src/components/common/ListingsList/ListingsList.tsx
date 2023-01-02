import { Button, Icon, TextField } from '@mui/material'
import React, { useState } from 'react'
import { Listing } from '../../../model/Listing';
import { ListingCard } from './ListingCard';

export const ListingsList: React.FC = () => {
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
    return (
        <div className='h-full px-4 py-4 space-y-4 bg-blue-100'>
            <div className='flex flex-col gap-4 items-center w-full'>
                <div className='flex flex-row gap-5'>
                    <Button variant="outlined">Newest</Button>
                    <Button variant="outlined">Expiring soon</Button>
                </div>

                <ListingCard listing={testListing} />
                <ListingCard listing={testListing} />
                <ListingCard listing={testListing} />
                
            </div>
        </div>
    )
}
