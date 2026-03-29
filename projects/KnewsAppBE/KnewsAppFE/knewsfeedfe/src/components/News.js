import { useState , useEffect } from "react";
import FetchNews from "../functions/fetchNews";
function News() {

  return (
    <div className="news-container row d-flex">
      
      <div className="col-12 border border-black my-1">
        <FetchNews /> 
      </div>

    </div>
  );
};


export default News;