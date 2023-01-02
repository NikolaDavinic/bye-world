import { Button, Icon, TextField } from '@mui/material'
import React, { useState } from 'react'

export const Listings: React.FC = () => {
    const [keyword, setKeyword] = useState<string>("");
    const [skill, setSkill] = useState<string>("");
    const [city, setCity] = useState<string>("");
    const [seniority, setSeniority] = useState<string>("");

    return (
        <div className='h-1/4 flex flex-col px-4 py-4 space-y-4 bg-gray-100'>
            <h1 className='font-bold'>Listings search</h1>
            <div className='flex flex-row justify-center gap-6'>
                <TextField id="keyword" label="Keyword search" variant="outlined" onChange={e => setKeyword(e.target.value)} value={keyword} />
                <TextField id="skill" label="Skill" variant="outlined" onChange={e => setSkill(e.target.value)}
                    value={skill} />
                <TextField id="city" label="City" variant="outlined" onChange={e => setCity(e.target.value)}
                    value={city} />
                <TextField id="seniority" label="Seniority" variant="outlined" onChange={e => setSeniority(e.target.value)}
                    value={seniority} />
                <Button variant='contained' startIcon={
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
            {/* </div> */}
        </div>
    )
}
