import React from "react";
import headerBackground from "../assets/navigation-back.png";
import Notifications from "./Notifications";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { IconButton } from "@mui/material";

const Header = () => {
  return (
    <header
      className="text-white p-4 flex items-center justify-between"
      style={{
        backgroundImage: `url(${headerBackground})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "#163e73",
      }}
    >
      <Link to={"/"}>
        <IconButton aria-label="home">
          <HomeIcon />
        </IconButton>
      </Link>

      <div>
        <h1 className="text-xl font-bold">
          National Energy and Emission Modeling and Analysis Tool
        </h1>
        <Notifications />
      </div>

      <Link
        to={"/signin"}
        className="text-white font-semibold py-1 px-4 rounded-md border border-black shadow-sm"
        style={{
          backgroundColor: "#163e73",
        }}
      >
        Sign In
      </Link>
    </header>
  );
};

export default Header;
