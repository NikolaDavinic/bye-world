import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import { Divider, Icon, IconButton, MenuItem, Select, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { api } from '../../constants';
import { Listing } from '../../model/Listing';
import { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
interface AddListingModalProps {
    isOpen: boolean,
    handleModalClose: () => void
}
interface SkillDTO {
    name: string,
    proficiency: string
}
interface ListingDTO {
    title: String;
    description: String;
    requirements: SkillDTO[];
    postingDate: Date;
    closingDate: Date;
    companyId: Number;
    cityName: string;
}
export const AddListingModal: React.FC<AddListingModalProps> = ({
    isOpen,
    handleModalClose
}) => {
    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen])
    const [open, setOpen] = React.useState(false);

    // const handleClickOpen = () => {
    //     setOpen(true);
    // };
    const navigate = useNavigate();
    const handleClose = () => {
        handleModalClose();
    };

    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [cityName, setCityName] = useState<string>('');
    const [companyId, setCompanyId] = useState<number>(0);
    const [closingDate, setClosingDate] = useState<Date>(new Date());
    const [postingDate, setPostingDate] = useState<Date>(new Date());
    const [requirements, setRequirements] = useState<SkillDTO[]>([
        { name: "", proficiency: "" }
    ]);


    const onSubmit = () => {
        const data: ListingDTO = {
            title: title,
            cityName: cityName,
            closingDate: closingDate,
            postingDate: postingDate,
            companyId: companyId,
            description: description,
            requirements: requirements
        }
        api
            .post("/listing/add", data)
            .then((response: AxiosResponse<Listing>) => {
                return navigate("/listing/" + response.data.id);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <div>
            {/* <Button variant="outlined" onClick={handleClickOpen}>
                Open form dialog
            </Button> */}
            <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth={"md"}>
                <DialogTitle>New Listing</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter new listing details.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        variant="standard"
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                    />
                    {/* TODO:Sredi da se select napuni na nazivima kompanija korisnika a value item-a je id izabrane kompanije */}
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Company"
                        fullWidth
                        value={companyId}
                        variant="standard"
                        onChange={(e) => setCompanyId(Number(e.target.value))}
                    >
                        <MenuItem value={10}>Company 1</MenuItem>
                        <MenuItem value={20}>Company 2</MenuItem>
                        <MenuItem value={30}>Company 3</MenuItem>
                    </Select>
                    {/* TODO: Sredi date  */}
                    <TextField
                        margin="dense"
                        label="Closing Date"
                        className='w-1/3'
                        type="date"
                        variant="standard"
                        onChange={(e) => setClosingDate(new Date(e.target.value))}
                        value={closingDate}
                    />
                    <TextField
                        margin="dense"
                        label="City"
                        fullWidth
                        variant="standard"
                        onChange={(e) => setCityName(e.target.value)}
                        value={cityName}
                    />
                    <Typography gutterBottom variant="body1">
                        Select required skills:
                    </Typography>
                    {/* <Divider variant="fullWidth" /> */}
                    {
                        requirements.map((r, ind) => (
                            <div className='flex flex-row items-center'>
                                <TextField
                                    id={String(ind)}
                                    className='w-1/2'
                                    margin="dense"
                                    label="Skill"
                                    variant="outlined"
                                    onChange={(e) => setCityName(e.target.value)}
                                    value={requirements[ind].name}
                                />
                                <Select
                                    labelId="demo-simple-select-label"
                                    id={String(ind)}
                                    margin="dense"
                                    label="Seniority"
                                    className='w-1/4'
                                    value={requirements[ind].proficiency}
                                    variant="outlined"
                                    onChange={(e) => setCompanyId(Number(e.target.value))}
                                >
                                    <MenuItem value="junior">Junior</MenuItem>
                                    <MenuItem value="medior">Medior</MenuItem>
                                    <MenuItem value="senior">Senior</MenuItem>
                                </Select>
                                <IconButton aria-label="add" color="primary"
                                    onClick={() => { setRequirements(prevReq => [...prevReq, { name: "", proficiency: "" }]) }}>
                                    <Icon className="material-symbols-outlined">add</Icon>
                                </IconButton>
                                {requirements.length > 1 && <IconButton aria-label="delete" color="error"
                                    onClick={() => {
                                        setRequirements(prevReq => prevReq.filter(p => prevReq.indexOf(p) != ind))
                                    }}>
                                    <Icon className="material-symbols-outlined">delete</Icon>
                                </IconButton>}
                            </div>
                        ))
                    }
                    {/* <div>
                        <TextField

                            className='w-1/2'
                            margin="dense"
                            label="Skill"
                            variant="outlined"
                            onChange={(e) => setCityName(e.target.value)}
                            value={cityName}
                        />
                        <TextField
                            className='w-1/4'
                            margin="dense"
                            label="Seniority"
                            variant="outlined"
                            onChange={(e) => setCityName(e.target.value)}
                            value={cityName}
                        />
                    </div> */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose()}>Cancel</Button>
                    <Button variant='contained' onClick={() => onSubmit()}>Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}