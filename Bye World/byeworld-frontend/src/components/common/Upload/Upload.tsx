import { Button } from "@mui/material";
import React, { SyntheticEvent, useRef } from "react";
import MatIcon from "../MatIcon/MatIcon";

interface UploadProps {
  text: string;
  onChange: (file: File) => void;
}

const Upload = ({ text, onChange }: UploadProps) => {
  const input = useRef(null);

  const fileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;

    if (file) {
      onChange(file[0]);
    }
  };

  const handleClick = () => {
    //@ts-ignore
    input.current.click();
  };

  return (
    <div style={{ width: "100%" }}>
      <Button
        variant="outlined"
        onClick={handleClick}
        style={{ width: "100%" }}
      >
        <MatIcon color="primary">attach_file</MatIcon>
        {text}
      </Button>
      <input
        ref={input}
        id="file"
        type="file"
        style={{ display: "none" }}
        onChange={(e) => fileSelected(e)}
      />
    </div>
  );
};

export default Upload;
