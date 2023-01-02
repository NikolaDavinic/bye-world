import { Button, Icon, TextField } from '@mui/material'
import React, { useState } from 'react'
import { Listing } from '../../../model/Listing';
import { ListingCard } from './ListingCard';

export const ListingsList: React.FC = () => {
    const testListing: Listing = {
        ID: 1,
        ClosingDate: new Date(Date.now()),
        Description: "Ovo je primer opisa posla",
        PostingDate: new Date(Date.now()),
        Requirements: [],
        Title: "Java Senior Developer",
        City: undefined,
        Company: undefined
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
