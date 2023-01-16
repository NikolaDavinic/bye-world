import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from 'react';
import { Icon, IconButton, MenuItem, Select, Typography } from '@mui/material';
import { api } from '../../constants';
import { useNavigate } from 'react-router-dom';
import { Company } from '../../model/Company';
import { useApi } from '../../hooks/api.hook';
import { useAuthContext } from '../../contexts/auth.context';
import { Editor, EditorState } from "react-draft-wysiwyg";
import { convertToRaw } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import Paper from '@mui/material/Paper';

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

    const navigate = useNavigate();
    const handleClose = () => {
        handleModalClose();
    };

    const [skills, setSkills] = useState<SkillDTO[]>([
        { name: "", proficiency: "" }
    ]);


    const onSubmit = () => {
        const data: SkillDTO[] = skills;
        api
            .post("/skill/add", data)
            .then((response) => {
                // return navigate("/listing/" + response.data[0].id);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <div>
            <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth={"md"}>
                <DialogTitle>Edit user skills</DialogTitle>
                <DialogContent>
                    {/* <Divider variant="fullWidth" /> */}
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
                    <Button variant='contained' onClick={() => onSubmit()}>Add</Button>
                </DialogActions>
            </Dialog>
            {/* <Snackbar open={open} autoHideDuration={6000} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                onClose={handleClose}>
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    This is a success message!
                </Alert>
            </Snackbar> */}
        </div>
    );
}