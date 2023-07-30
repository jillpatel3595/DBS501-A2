import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

export default function Dropdown({ data, label, sx, required, fullWidth, selection, setSelection }) {
  const [inputValue, setInputValue] = useState("");
  const [value, setValue] = useState(null);

  useEffect(() => {
    setValue(selection ? findOption(selection) : null);
    setInputValue(selection?.label || "");
  }, [data, selection]);

  const findOption = (value) => {
    return data.find((option) => option.label === value.label) || null;
  };

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        if (newValue) {
          setValue(newValue);
          setSelection(newValue);
        } else {
          setValue(null);
          setSelection(null);
        }
      }}
      inputValue={inputValue}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      options={data}
      getOptionLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => option.label === value.label}
      sx={{ width: "100%", marginBottom: "32px", ...sx }}
      renderInput={(params) => <TextField {...params} required={required} fullWidth={fullWidth} label={label} />}
    />
  );
}
