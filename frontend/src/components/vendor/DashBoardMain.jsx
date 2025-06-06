import React, { useState } from "react";
import DashBoardSideBar from "./DashBoardSideBar.jsx";
import DashboardServices from "./DashboardServices.jsx";




function DashBoardMain() {

  
  return (
    <>
      <DashBoardSideBar />
      <div>
        <DashboardServices/>
      </div>
    </>
  );
}

export default DashBoardMain;
