import React, { ChangeEvent, useEffect, useState } from 'react'
import { useAuthContext } from '../../contexts/auth.context';
import { useNavigate } from 'react-router-dom';
import { Button, Dialog, DialogActions, DialogTitle } from '@mui/material';

interface SendCVModalProps {
    isOpen: boolean;
    handleModalClose: () => void;
}

export const SendCVModal: React.FC<SendCVModalProps> = ({
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
    const { isAuthenticated, user } = useAuthContext();

    const [file, setFile] = useState<File>();

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUploadClick = () => {
        if (!file) {
            return;
        }

        // 👇 Uploading the file using the fetch API to the server
        fetch('https://httpbin.org/post', {
            method: 'POST',
            body: file,
            // 👇 Set headers manually for single file upload
            headers: {
                'content-type': file.type,
                'content-length': `${file.size}`, // 👈 Headers need to be a string
            },
        })
            .then((res) => res.json())
            .then((data) => console.log(data))
            .catch((err) => console.error(err));
    };




    return (
        <div>
            <Dialog open={open} onClose={handleClose} fullWidth={true} maxWidth={"md"}>
                <div className='flex flex-col items-center m-2 p-5'>
                    <DialogTitle>Choose your CV here</DialogTitle>
                    <input type="file" onChange={handleFileChange} />

                    <div className='pb-5'>{file && `${file.name} - ${file.type}`}</div>
                </div>
                <DialogActions>
                    <Button onClick={() => handleClose()}>Cancel</Button>
                    <Button variant='contained' onClick={handleUploadClick}>Upload</Button>
                </DialogActions>

            </Dialog>
        </div>
    )
}
