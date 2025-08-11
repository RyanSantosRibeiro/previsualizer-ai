"use client";

import React from "react";

export default function NewsList({ news, title, loading, color }) {
  if (loading) {
    return (
      <div className="fixed top-[100px] left-0 h-[80vh] w-[30vw] flex flex-col gap-4 p-4 z-50">
        <div className="backdrop-blur-[3px] border border-white/20 rounded-2xl shadow-lg overflow-y-auto p-4">
          <p className="text-white">Searching news...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="fixed top-[100px] left-0 h-[80vh] w-[30vw] flex flex-col gap-4 p-4 z-50">
      <div style={{borderColor: color || "white"}} className="backdrop-blur-[3px] border border-white/20 rounded-2xl shadow-lg overflow-y-auto p-4"> 
        <h2  style={{color: color || "white"}} className="text-white text-lg font-bold p-3">{title}</h2>
        <div className="flex flex-col">
          {news.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 cursor-pointer transition-all opacity-0 animate-fadeSlideIn"
              style={{
                animationDelay: `${index * 0.15}s`,
                transform: "transform: translateX(40px)",
              }}
            >
              <div className="flex-1">
                <h3 className="text-white text-sm font-semibold">
                  {item.title}
                </h3>
                <p className="text-white/70 text-xs">{item.shortDescription}</p>
                <p className="text-white/70 text-xs font-bold mt-1">
                  {item.source} -{" "}
                  <span className="italic font-normal">{item.date}</span>
                  {item.link && <a href={item.link}>See about</a>}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeSlideIn {
          animation: fadeSlideIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

// date
// :
// "2025-08-11"
// description
// :
// "A severe heatwave has gripped Europe, with temperatures soaring to unprecedented levels in several countries. Infrastructure is struggling to cope, and health officials are urging people to take precautions. Wildfires are also a major concern."
// metaData
// :
// {author: 'Laura Simmons', views: '125000', other: 'Includes interactive temperature map'}
// shortDescription
// :
// "Record-breaking temperatures are causing widespread disruption and health concerns across Europe."
// source
// :
// "BBC News"
