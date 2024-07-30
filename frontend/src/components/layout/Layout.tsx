import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="max-w-5xl mx-auto px-5 md:px-10 relative py-5">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Layout;
