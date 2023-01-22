import {
  FormControl,
  InputAdornment,
  Popover,
  Popper,
  TextField,
  Typography,
} from "@mui/material";
import React, { FunctionComponent, useEffect, useRef, useState } from "react";
import { useApi } from "../../../hooks/api.hook";
import { useDebounce } from "../../../hooks/debounce.hook";
import { User } from "../../../model/User";
import MatIcon from "../MatIcon/MatIcon";
import UserCard from "./UserCard";

const UsersSearch: FunctionComponent = () => {
  const [showClearIcon, setShowClearIcon] = useState("none");
  const [searchField, setSearchField] = useState<string>("");

  const debouncedSearchField = useDebounce(searchField, 500);

  const { result: users, setResult } = useApi<User[]>(
    debouncedSearchField.length < 3
      ? ""
      : `user/search?name=${debouncedSearchField}`
  );

  const ref = useRef(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setShowClearIcon(event.target.value === "" ? "none" : "flex");
    setSearchField(event.target.value);
  };

  const handleClear = (): void => {
    setSearchField("");
    setResult([]);
  };

  return (
    <FormControl
      style={{ margin: 0 }}
      sx={{ bgcolor: "white", borderRadius: "5px" }}
    >
      <TextField
        size="small"
        ref={ref}
        value={searchField}
        variant="outlined"
        placeholder="Search users"
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <MatIcon>search</MatIcon>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment
              position="end"
              style={{ display: showClearIcon }}
              onClick={handleClear}
            >
              <MatIcon style={{ cursor: "pointer" }}>clear</MatIcon>
            </InputAdornment>
          ),
        }}
      />
      <Popper
        onClick={handleClear}
        open={Boolean((users?.length ?? 0) > 0)}
        anchorEl={ref.current}
        // onClose={handleClear}
        // anchorOrigin={{
        //   vertical: "bottom",
        //   horizontal: "left",
        // }}
      >
        {users?.map((user) => (
          <UserCard key={user.id} user={user}></UserCard>
        ))}
      </Popper>
    </FormControl>
  );
};

export default UsersSearch;
