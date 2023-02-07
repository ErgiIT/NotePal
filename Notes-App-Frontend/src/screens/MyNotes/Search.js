import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "./MyNotes.css";

const Search = ({ handleSearchNote }) => {
  return (
    <div className="search">
      <FontAwesomeIcon icon={faSearch} className="search-icons" />
      <input
        onChange={(event) => handleSearchNote(event.target.value)}
        type="text"
        placeholder="Type to search..."
      />
    </div>
  );
};

export default Search;
