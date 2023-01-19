import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import { Icon, IconButton, MenuItem, Select, Typography } from "@mui/material";
import { api } from "../../constants";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Company } from "../../model/Company";
import { useApi } from "../../hooks/api.hook";
import { useAuthContext } from "../../contexts/auth.context";
import { Editor, EditorState } from "react-draft-wysiwyg";
import { convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import Paper from "@mui/material/Paper";

interface AddListingModalProps {
  isOpen: boolean;
  handleModalClose: () => void;
}
interface SkillDTO {
  name: string;
  proficiency: string;
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
  handleModalClose,
}) => {
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);
  const [open, setOpen] = React.useState(false);

  const navigate = useNavigate();
  const handleClose = () => {
    handleModalClose();
  };

  const { isAuthenticated, user } = useAuthContext();

  const { result, loading, error } = useApi<any>(
    `company/getUserCompanies/${user?.id}`
  );

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [descriptionEditor, setDescriptionEditor] = useState<EditorState>();
  const [cityName, setCityName] = useState<string>("");
  const [companyId, setCompanyId] = useState<number>(0);
  const [closingDate, setClosingDate] = useState<Date>(new Date());
  const [postingDate, _] = useState<Date>(new Date());
  const [requirements, setRequirements] = useState<SkillDTO[]>([
    { name: "", proficiency: "" },
  ]);

  const onSubmit = () => {
    const data: ListingDTO = {
      title: title,
      cityName: cityName,
      closingDate: closingDate,
      postingDate: postingDate,
      companyId: companyId,
      // description: description,
      description: descriptionEditor?.getCurrentContent()
        ? draftToHtml(convertToRaw(descriptionEditor?.getCurrentContent()))
        : "",
      requirements: requirements,
    };
    api
      .post("/listing/add", data)
      .then((response) => {
        return navigate("/listing/" + response.data[0].id);
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
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={"md"}
      >
        <DialogTitle>New Listing</DialogTitle>
        <DialogContent>
          <DialogContentText>Enter new listing details.</DialogContentText>
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
          {/* <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        variant="standard"
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                    /> */}
          <Paper>
            <div className="h-1/2">
              <Editor
                placeholder="Job description"
                editorState={descriptionEditor}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={(e) => setDescriptionEditor(e)}
              />
            </div>
          </Paper>
          {/* TODO:Sredi da se select napuni na nazivima kompanija korisnika a value item-a je id izabrane kompanije */}
          {result && (
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Company"
              fullWidth
              value={companyId}
              variant="standard"
              onChange={(e) => setCompanyId(Number(e.target.value))}
            >
              {result.companies.map((c: Company) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.name}
                </MenuItem>
              ))}
              <MenuItem disabled selected value={0}>
                Company
              </MenuItem>
              {/* <MenuItem value={13}>Nignite</MenuItem>
                        <MenuItem value={12}>Microsoft opet</MenuItem>
                        <MenuItem value={12}>Microsoft</MenuItem> */}
            </Select>
          )}
          <TextField
            margin="dense"
            label="Closing Date"
            className="w-1/3"
            type="date"
            variant="standard"
            onChange={(e) => setClosingDate(new Date(e.target.value))}
            value={closingDate.toISOString().split("T")[0]}
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
          {requirements.map((r, ind) => (
            <div key={ind} className="flex flex-row items-center">
              <TextField
                id={String(ind)}
                className="w-1/2"
                margin="dense"
                label="Skill"
                variant="outlined"
                onChange={(e) =>
                  setRequirements((prevReqs) =>
                    prevReqs.map((req) => {
                      if (prevReqs.indexOf(req) == ind)
                        return { ...req, name: e.target.value };
                      else return req;
                    })
                  )
                }
                value={requirements[ind].name}
              />
              <Select
                labelId="demo-simple-select-label"
                id={String(ind)}
                margin="dense"
                label="Seniority"
                className="w-1/4"
                value={requirements[ind].proficiency}
                variant="outlined"
                onChange={(e) =>
                  setRequirements((prevReqs) =>
                    prevReqs.map((req) => {
                      if (prevReqs.indexOf(req) == ind)
                        return { ...req, proficiency: e.target.value };
                      else return req;
                    })
                  )
                }
              >
                <MenuItem value="junior">Junior</MenuItem>
                <MenuItem value="medior">Medior</MenuItem>
                <MenuItem value="senior">Senior</MenuItem>
              </Select>
              <IconButton
                aria-label="add"
                color="primary"
                onClick={() => {
                  setRequirements((prevReq) => [
                    ...prevReq,
                    { name: "", proficiency: "" },
                  ]);
                }}
              >
                <Icon className="material-symbols-outlined">add</Icon>
              </IconButton>
              {requirements.length > 1 && (
                <IconButton
                  aria-label="delete"
                  color="error"
                  onClick={() => {
                    setRequirements((prevReq) =>
                      prevReq.filter((p) => prevReq.indexOf(p) != ind)
                    );
                  }}
                >
                  <Icon className="material-symbols-outlined">delete</Icon>
                </IconButton>
              )}
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleClose()}>Cancel</Button>
          <Button variant="contained" onClick={() => onSubmit()}>
            Add
          </Button>
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
};
