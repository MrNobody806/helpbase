"use client";
import React from "react";
import DesktopHeader from "./DesktopHeader";
import MobileHeader from "./MobileHeader";

const Header = () => {
  return (
    <>
      <div className="w-full md:flex justify-center items-center hidden">
        <DesktopHeader />
      </div>
      <div className="w-full flex justify-center items-center md:hidden ">
        <MobileHeader />
      </div>
    </>
  );
};

export default Header;
