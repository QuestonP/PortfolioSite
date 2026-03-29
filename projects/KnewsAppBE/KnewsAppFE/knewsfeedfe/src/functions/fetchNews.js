import React, { useEffect, useState } from 'react';
import { apiLink } from '../constants';

function FetchNews() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/data'); // Replace with your backend API endpoint
      const responseData = await response.json();
      setData(responseData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const displayNews = () => {
    return newsDataArray.map((news, index) => {
      const date = news.publishedAt.split('T')[0];

      return (
        <div key={index} className="card col-3">
          <img
            height=""
            width=""
            src={news.urlToImage}
            alt="News Image"
          />
          <div className="card-body">
            <div
              className="card-title fw-bolder container"
              style={{ textAlign: 'center', fontSize: '15px' }}
            >
              {news.title}
            </div>
            <h6 className="text-dark">{date}</h6>
            <a
              className="btn btn-dark"
              target="_blank"
              rel="noopener noreferrer"
              href={news.url}
            >
              Learn More..
            </a>
          </div>
        </div>
      );
    });
  };

  return <div id="news-container" className="d-flex flex-wrap">{displayNews()}</div>;
};

export default FetchNews;
