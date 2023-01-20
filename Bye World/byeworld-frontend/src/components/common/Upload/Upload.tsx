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
    /* <div [style]="{ margin: '5px 0', overflow: 'auto', height: '100%' }">
    <form class="form-group">
      <div
        [style]="{ overflow: 'hidden' }"
        fxLayout="column"
        fxLayoutAlign="start start">
        <div [style]="{ width: '100%' }">
          <mat-chip-list>
            <mat-chip
              *ngFor="let dodatak of dodaci"
              selected
              (removed)="remove(dodatak)">
              {{ dodatak.naziv }}
              <mat-icon matChipRemove>cancel</mat-icon>
            </mat-chip>
          </mat-chip-list>
        </div>
        <div *ngIf="uploading?.length" [style]="{ width: '100%' }">
          <div *ngFor="let uplfile of uploading" class="file-uploading">
            {{ uplfile.dodatak.naziv }}
            <mat-progress-bar
              mode="determinate"
              [value]="uplfile.progress"></mat-progress-bar>
          </div>
        </div>
      </div>
    </form>
  </div></div> */
  );
};

export default Upload;
