import React from "react";
import { Route, Routes } from "react-router";
import AddNewPost from "./Pages/PostManagement/AddNewPost";
import AllPost from "./Pages/PostManagement/AllPost";
import UpdatePost from "./Pages/PostManagement/UpdatePost";

const App = () => {
  return (
    <div>
      <React.Fragment>
        <Routes>
          <Route path="/" element={<AllPost />} />
          <Route path="/addNewPost" element={<AddNewPost />} />
          <Route path="/updatePost/:id" element={<UpdatePost />} />
        </Routes>
      </React.Fragment>
    </div>
  );
};

export default App;