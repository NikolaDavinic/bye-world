import { Button, Icon, TextField } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { api } from '../../constants';
import { Listing } from '../../model/Listing';
import { ListingCard } from '../common/ListingsList/ListingCard';
import { ListingsList } from '../common/ListingsList/ListingsList';
export const Listings: React.FC = () => {
    const [keyword, setKeyword] = useState<string>("");
    const [skill, setSkill] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [seniority, setSeniority] = useState<string>("");
    const onFilter = () => {
        getFilteredCompanies(keyword, city, skill, seniority);
    }
    const [listings, setListings] = useState<Listing[]>([]);

    async function getFilteredCompanies(keyword: string, city: string, skill: string, seniority: string) {
        const response = await api.get("/listing/filter", {
            params: {
                keyword,
                city,
                skill,
                seniority
            },
        });
        setListings(response.data);
    }
    useEffect(() => {
        onFilter();
    }, []);
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



    return (
        <div>
            <div className='h-1/4 flex flex-col px-4 py-4 space-y-4 bg-slate-50'>
                <h1 className='font-bold'>Listings search</h1>
                <div className='flex flex-row justify-center gap-6'>
                    <TextField id="keyword" label="Keyword search" variant="outlined" onChange={e => setKeyword(e.target.value)} value={keyword} />
                    <TextField id="skill" label="Skill" variant="outlined" onChange={e => setSkill(e.target.value)}
                        value={skill} />
                    <TextField id="city" label="City" variant="outlined" onChange={e => setCity(e.target.value)}
                        value={city} />
                    <TextField id="seniority" label="Seniority" variant="outlined" onChange={e => setSeniority(e.target.value)}
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

            </div>
            <div className='bg-white h-full'>
                <ListingsList listings={listings} />

                {/* <ListingCard listing={testListing} /> */}

            </div>

        </div>
    )
}
