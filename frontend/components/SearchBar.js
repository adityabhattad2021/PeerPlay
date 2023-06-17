import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Paper, IconButton } from "@mui/material";
import { useStateContext } from "@/context";

export default function SearchBar() {
  const { keyword, setKeyword } =
    useStateContext();


  return (
    <Paper
      component="form"
      sx={{
        borderRadius: 20,
        border: "1px solid #e3e3e3",
        pl: 2,
        boxShadow: "none",
        mr: { sm: 5 },
      }}
    >
      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="search-bar"
        placeholder="Search..."
      />
      <IconButton
        sx={{ p: "10px", color: "red" }}
        aria-label="search"
        color="primary"
      >
        <SearchIcon color="success" />
      </IconButton>
    </Paper>
  );
}
