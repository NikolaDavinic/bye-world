import { Button, Icon, TextField } from '@mui/material'
import React from 'react'

export const Listings: React.FC = () => {
    return (
        <div className='h-1/4 flex flex-col px-4 py-4 space-y-4'>
            <h2 className='font-bold'>Pretraga poslova</h2>
            <div className='flex flex-row justify-center gap-6'>
                <TextField id="keyword" label="Keyword search" variant="outlined" />
                <TextField id="skill" label="Skill" variant="outlined" />
                <TextField id="city" label="City" variant="outlined" />
                <TextField id="seniority" label="Seniority" variant="outlined" />
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
