import { Button, Icon, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { api } from '../../constants';
import { Listing } from '../../model/Listing';
import { ListingsList } from '../common/ListingsList/ListingsList';
export const Listings: React.FC = () => {
    const [keyword, setKeyword] = useState<string>("");
    const [skill, setSkill] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [seniority, setSeniority] = useState<string>("");
    const [sortNewest, setSortNewest] = useState<Boolean>(true);
    const onFilter = () => {
        getFilteredListings(keyword, city, skill, seniority, sortNewest);
    }
    const [listings, setListings] = useState<Listing[]>([]);

    const onSort = (newest: Boolean) => {
        if (sortNewest != newest)
            setSortNewest(newest)
    }
    async function getFilteredListings(keyword: string, city: string, skill: string, seniority: string, sortNewest: Boolean) {
        const response = await api.get("/listing/filter", {
            params: {
                keyword,
                city,
                skill,
                seniority,
                sortNewest
            },
        });
        setListings(response.data);
    }
    useEffect(() => {
        onFilter();
    }, [sortNewest]);
    // const testListing:Listing={
    //     id:1,
    //     closingDate:new Date(Date.now()),
    //     description:"Ovo je primer opisa posla",
    //     postingDate:new Date(Date.now()),
    //     requirements:[],
    //     title:"Java Senior Developer",
    //     city:undefined,
    //     company:undefined
    // }
    const handleKeyPress = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            onFilter();
        }
    }

    return (
        <div>
            <div className='h-1/4 flex flex-col px-4 py-4 space-y-4 bg-white drop-shadow-lg'>
                <h1 className='font-bold'>Listings search</h1>
                <div className='flex flex-row justify-center gap-6'>
                    <TextField id="keyword" label="Keyword search" variant="outlined" onChange={e => setKeyword(e.target.value)}
                        onKeyDown={e => handleKeyPress(e)}
                        value={keyword} />
                    <TextField id="skill" label="Skill" variant="outlined" onChange={e => setSkill(e.target.value)}
                        onKeyDown={e => handleKeyPress(e)}
                        value={skill} />
                    <TextField id="city" label="City" variant="outlined" onChange={e => setCity(e.target.value)}
                        onKeyDown={e => handleKeyPress(e)}
                        value={city} />
                    <TextField id="seniority" label="Seniority" variant="outlined" onChange={e => setSeniority(e.target.value)}
                        onKeyDown={e => handleKeyPress(e)}
                        value={seniority} />
                    <Button variant='contained' onClick={() => onFilter()} startIcon={
                        <Icon
                            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
                            className="material-symbols-outlined"
                        >
                            filter_alt
                        </Icon>
                    }>
                        Filter
                    </Button>
                </div>
                <div className='flex flex-row gap-5 justify-center'>
                    <Button variant={sortNewest ? "contained" : "outlined"} onClick={() => onSort(true)} >Newest</Button>
                    <Button variant={sortNewest ? "outlined" : "contained"} onClick={() => onSort(false)} >Expiring soon</Button>
                </div>
            </div>
            <div className='bg-gray-100 h-full min-h-full '>
                <ListingsList listings={listings} />
            </div>

        </div>
    )
}
