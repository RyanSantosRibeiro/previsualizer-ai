"use client";

import React from "react";

export default function PreviewTimeLine({
  preview,
  title,
  loading,
  getPreview,
  selectedPreview,
  setSelectedPreview,
  color
}) {
  return (
    <>
      {selectedPreview != null && (
        <div className="fixed top-[100px] right-0 h-[80vh] w-[30vw] flex flex-col gap-4 p-4 z-50">
          <div className="backdrop-blur-[3px] border border-white/20 rounded-2xl shadow-lg overflow-y-auto p-4">

            <div className="flex flex-col">
              <div className="flex flex-col gap-1 p-3 rounded-xlcursor-pointer transition-all animate-fadeSlideIn">
                {/* Data e confiança */}
                <div className="flex justify-between items-center">
                  <span className="text-lg text-white/90">
                    {selectedPreview.order}º
                  </span>
                  <span className="text-xs text-white/50">
                    {selectedPreview.date}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-[1px] rounded-full ${
                      selectedPreview.confidenceLevel === "Alto"
                        ? "bg-green-700/30 text-green-300"
                        : selectedPreview.confidenceLevel === "Médio"
                        ? "bg-yellow-700/30 text-yellow-300"
                        : "bg-red-700/30 text-red-300"
                    }`}
                  >
                    {selectedPreview.confidenceLevel}
                  </span>
                </div>

                {/* Título */}
                <h3 style={{color}} className="text-white text-sm font-semibold">
                  {selectedPreview.title}
                </h3>

                {/* Resumo curto */}
                <p className="text-white/70 text-xs">
                  {selectedPreview.shortDescription}
                </p>

                {/* Descrição narrativa */}
                <p className="text-white/60 text-xs italic mt-1">
                  {selectedPreview.description}
                </p>

                {/* Descrição narrativa */}
                <p className="text-white/90 text-xs mt-1">
                  <b>Forecast:</b> {selectedPreview.consequence}
                </p>

                {/* Contexto da categoria */}
                {selectedPreview.categoryContext && (
                  <p className="text-white/40 text-[12px] mt-1">
                    Contexto: {selectedPreview.categoryContext}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="fixed bottom-[10px] right-[5vw] w-[90vw] flex flex-col gap-4 p-4 z-50">
        <div className="backdrop-blur-[3px]  rounded-2xl shadow-lg p-4 gap-5">
          <div className="flex flex-row justify-between items-center">
            {preview
              ?.sort((a, b) => a.order - b.order)
              .map((item, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedPreview(item)}
                  className="relative group flex flex-col gap-1  cursor-pointer transition-all opacity-0 animate-fadeSlideIn rounded-full"
                  style={{
                    animationDelay: `${index * 0.15}s`,
                  }}
                >
                  {/* Data e confiança */}
                  <div className="hover:bg-white/10 rounded-full flex flex-col justify-center items-center border border-white/20 w-[80px] h-[80px]">
                    {/* Título */}
                    <h3 className="text-white text-xs font-semibold max-w-[100px] overflow-clip whitespace-nowrap overflow-ellipsis">
                      {item.title}
                    </h3>
                    <span className="text-xs text-white/50">{item.date}</span>
                  </div>

                  <div className="bg-[#0c1425]  p-2 shadow-lg z-[100] group-hover:opacity-100  group-hover:flex flex-col hidden opacity-0 absolute bottom-[100%] w-[200px] h-auto rounded-md">
                    <div className="flex justify-between items-center">
                      <p className="text-white/40">{item.order}º</p>
                      <span
                        className={`text-[10px] px-2 py-[1px] rounded-full flex item-center justify-center ${
                          item.confidenceLevel === "Alto"
                            ? "bg-green-700/30 text-green-300"
                            : item.confidenceLevel === "Médio"
                            ? "bg-yellow-700/30 text-yellow-300"
                            : "bg-red-700/30 text-red-300"
                        }`}
                      >
                        {item.confidenceLevel}
                      </span>
                    </div>

                    {/* Contexto da categoria */}
                    {item.title && (
                      <p className="text-white/90 text-[10px] mt-1">
                        {item.title}
                      </p>
                    )}

                    {/* Contexto da categoria */}
                    {item.categoryContext && (
                      <p className="text-white/40 text-[10px] mt-1">
                        Contexto: {item.categoryContext}
                      </p>
                    )}
                  </div>
                </div>
              ))}
          </div>
          <div className="flex justify-between items-center mt-3">
            <h2 className="text-white text-sm font-semibold">Timeline</h2>
            {loading ? (
              <p className="text-white text-sm font-semibold">
                Generating future preview...
              </p>
            ) : (
              <button
                onClick={getPreview}
                style={{backgroundColor: color}}
                className="text-xs text-white btn btn-primary rounded-sm cursor-pointer border-none"
              >
                Generate Future
              </button>
            )}
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
    </>
  );
}
