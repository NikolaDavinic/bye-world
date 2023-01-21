import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import { Alert, Icon, IconButton, MenuItem, Select, Snackbar, Typography } from '@mui/material';
import { api } from '../../constants';

interface UserSkillsModalProps {
    isOpen: boolean,
    handleModalClose: () => void
}

interface SkillDTO {
    name: string,
    proficiency: string
}

export const UserSkillsModal: React.FC<UserSkillsModalProps> = ({
    isOpen,
    handleModalClose
}) => {

    useEffect(() => {
        setOpen(isOpen);
    }, [isOpen])

    const [open, setOpen] = React.useState(false);
    const [showSnackbar, setShowSnackbar] = React.useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState<string>("");

    const handleClose = () => {
        handleModalClose();
    };
    // useEffect(() => {
    //     const response = api.get("/skill/myskills")
    //         .then((result) => result.data.Length > 0 && setSkills(result.data));
    // }, []);
    const [skills, setSkills] = useState<SkillDTO[]>([
        { name: "", proficiency: "" }
    ]);
    useEffect(() => {
        const fetchData = async () => {
            const response = await api.get("/skill/myskills");
            response.data.length > 0 && setSkills(response.data);
        }

        fetchData()
            .catch(console.error);
    }, [])


    const onSubmit = () => {
        const data: SkillDTO[] = skills;
        api
            .put("/skill/edit", data)
            .then((response) => {
                // handleClose();
                setSnackbarMessage("Your skills are updated!");
                setShowSnackbar(true);
            })
            .catch((error) => {
                console.error(error);
                setSnackbarMessage("There was error updating user skills. Try again later!");
            });
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth={"md"}>
                <DialogTitle>Your skills</DialogTitle>
                <DialogContent>
                    {
                        skills.map((r, ind) => (
                            <div key={ind} className='flex flex-row items-center'>
                                <TextField
                                    id={String(ind)}
                                    className='w-1/2'
                                    margin="dense"
                                    label="Skill"
                                    variant="outlined"
                                    onChange={(e) => setSkills(prevReqs => prevReqs.map(req => {
                                        if (prevReqs.indexOf(req) == ind)
                                            return { ...req, name: e.target.value };
                                        else
                                            return req;
                                    }))}
                                    value={skills[ind].name}
                                />
                                <Select
                                    labelId="demo-simple-select-label"
                                    id={String(ind)}
                                    margin="dense"
                                    label="Seniority"
                                    className='w-1/4'
                                    value={skills[ind].proficiency}
                                    variant="outlined"
                                    onChange={(e) => setSkills(prevReqs => prevReqs.map(req => {
                                        if (prevReqs.indexOf(req) == ind)
                                            return { ...req, proficiency: e.target.value };
                                        else
                                            return req;
                                    }))}                                >
                                    <MenuItem value="junior">Junior</MenuItem>
                                    <MenuItem value="medior">Medior</MenuItem>
                                    <MenuItem value="senior">Senior</MenuItem>
                                </Select>
                                <IconButton aria-label="add" color="primary"
                                    onClick={() => { setSkills(prevReq => [...prevReq, { name: "", proficiency: "" }]) }}>
                                    <Icon className="material-symbols-outlined">add</Icon>
                                </IconButton>
                                {skills.length > 1 && <IconButton aria-label="delete" color="error"
                                    onClick={() => {
                                        setSkills(prevReq => prevReq.filter(p => prevReq.indexOf(p) != ind))
                                    }}>
                                    <Icon className="material-symbols-outlined">delete</Icon>
                                </IconButton>}
                            </div>
                        ))
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => handleClose()}>Cancel</Button>
                    <Button variant='contained' onClick={() => onSubmit()}>SAVE</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={showSnackbar} autoHideDuration={4000} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                onClose={() => setShowSnackbar(false)}>
                <Alert onClose={() => setShowSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}