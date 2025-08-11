"use client";
import * as THREE from "three";
import React, { useState, useEffect, useRef } from "react";
import Globe from "react-globe.gl";
import Header from "./Header";
import {
  getFutureTimelineByCategory,
  getNewsByCategory,
} from "../../../utils/news";
import NewsList from "./NewsList";
import bg from "./../../bg.png";
import PreviewTimeLine from "./PreviewTimeLine";

export default function Previsualizer() {
  const globeEl = useRef();
  const [geoData, setGeoData] = useState([]);
  const [news, setNews] = useState([]);
  const [preview, setPreview] = useState([]);
  const [options, setOptions] = useState({});
  const [selectedPreview, setSelectedPreview] = useState(null);
  const categories = [
    {
      name: "Money",
      color: "#118C4F",
    },
    {
      name: "Crypto",
      color: "#f69c3d",
    },
    {
      name: "Geopolitics",
      color: "#c1121f",
    },
    {
      name: "Climate",
      color: "#57cc99",
    },
  ];
  const [category, setCategory] = useState(categories[0]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAi, setLoadingAi] = useState(false);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    // Carrega dados GeoJSON dos países
    fetch("//unpkg.com/world-atlas/countries-110m.json")
      .then((res) => res.json())
      .then((worldData) => {
        const countries = Globe().hexPolygonsData(worldData);
        setGeoData(countries);
      });
  }, []);

  useEffect(() => {
    console.log({options, locations})
    if (selectedPreview?.city?.coord && globeEl.current) {
      const { lat, lng } = selectedPreview.city.coord; // certifique-se se é lon ou lng
      globeEl.current.pointOfView(
        { lat, lng, altitude: 1.5 }, // altitude ajusta o zoom
        1500 // duração da animação em ms
      );
    }
  }, [selectedPreview]);

  useEffect(() => {
    const scene = globeEl.current.scene();

    // resolução alta para evitar banding e manter nitidez
    const size = 10096;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");

    // gradiente escuro do universo
    const gradient = ctx.createLinearGradient(0, 0, 0, size);
    gradient.addColorStop(0, "#000000"); // preto total no topo
    gradient.addColorStop(1, "#03050a"); // azul muito escuro embaixo
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    // gerar estrelas aleatórias
    const numStars = 1000; // quantidade de estrelas
    for (let i = 0; i < numStars; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const radius = Math.random() * 1.5; // tamanho
      const alpha = 0.3 + Math.random() * 0.7; // brilho

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    }

    // criar textura
    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const geometry = new THREE.SphereGeometry(500, 60, 40);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
    });

    const skySphere = new THREE.Mesh(geometry, material);
    scene.add(skySphere);
  }, []);

  useEffect(() => {
    // load data
    fetch("./ne_110m_populated_places_simple.geojson")
      .then((res) => res.json())
      .then(({ features }) => setPlaces(features));
  }, []);

  useEffect(() => {
    fetchNews(category.name);
  }, [category]);

  const fetchNews = async (categoryName) => {
    const localNew = sessionStorage.getItem(`news-${categoryName}`);
    if (localNew) {
      console.log({ localNew });
      setNews(JSON.parse(localNew) || []);
      setLoading(false);
      return;
    }
    // Carrega dados GeoJSON dos países
    setLoading(true);
    const newsResponse = await getNewsByCategory(categoryName);
    console.log({ newsResponse });
    setNews(newsResponse || []);
    sessionStorage.setItem(
      `news-${categoryName}`,
      JSON.stringify(newsResponse)
    );
    setLoading(false);
  };
  const getPreview = async () => {
    const localNew = sessionStorage.getItem(`preview-${category.name}`);
    if (localNew) {
      const localNewParsed = JSON.parse(localNew);
      console.log({ localNew });
      setPreview(localNewParsed.data || []);
      setOptions(localNewParsed.options)
      setSelectedPreview(localNewParsed.data[0] || null);
      const locationsAux = localNewParsed?.data?.map((item) => ({
        name: item.title, // ou item.order, se preferir
        coord: {
          lat: item.city.coord.lat,
          lon: item.city.coord.lng,
        },
        ...item, // mantém todos os outros dados caso precise depois
      }));
      setLocations(locationsAux);
      setLoadingAi(false);
      return;
    }
    // Carrega dados GeoJSON dos países
    setLoadingAi(true);
    const newsResponse = await getFutureTimelineByCategory(category.name);
    console.log({ newsResponse });
    sessionStorage.setItem(
      `preview-${category.name}`,
      JSON.stringify(newsResponse)
    );
    setPreview(newsResponse?.data || []);
    setOptions(newsResponse.options)
    setSelectedPreview(newsResponse?.data[0] || []);
    const locationsAux = newsResponse?.data?.map((item) => ({
      name: item.title, // ou item.order, se preferir
      coord: {
        lat: item.city.coord.lat,
        lon: item.city.coord.lng,
      },
      ...item, // mantém todos os outros dados caso precise depois
    }));
    setLocations(locationsAux);
    setLoadingAi(false);
  };

  const handleCountryClick = (country) => {
    fetchNews(country.properties.name);
  };

  return (
    <div style={{ display: "flex", backgroundImage: `url(${bg.src})` }}>
      {/* <Header /> */}
      <div className="fixed top-0 left-0 w-screen flex justify-between items-center z-50 text-white gap-4 p-2 px-[10%]">
        <p className="font-bold text-2xl uppercase text-white/40 w-1/3">
          Previsualizer
        </p>
        <div className="tabs tabs-box bg-base-900 m-4 flex items-center justify-center flex-nowrap p-1 rounded-md gap-1 ">
          {categories?.map((i, index) => {
            return (
              <p
                key={index}
                className="tab p-2 cursor-pointer rounded-xs font-semibold"
                style={{
                  background:
                    i.name == category.name ? "#070c16" : "transparent",
                  color: i.name == category.name ? "#fff" : "#cfc9cb",
                  letterSpacing: ".5px",
                }}
                onClick={() => {
                  setCategory(i)
                  setPreview([])
                  setSelectedPreview(null)
                  setOptions(null)
                  setLocations([])
                }}
              >
                {i.name}
              </p>
            );
          })}
        </div>

        <p className="font-bold text-sm text-white/40 w-1/3 text-right">
          let an AI simulate the future based on the latest news
        </p>
      </div>

      <NewsList
        news={news}
        title={category.name}
        loading={loading}
        color={category.color}
      />
      <PreviewTimeLine
        color={category.color}
        setSelectedPreview={(e) => setSelectedPreview(e)}
        preview={preview}
        title={category.name}
        loading={loadingAi}
        getPreview={getPreview}
        selectedPreview={selectedPreview}
      />
      <div style={{ width: "100vw", height: "100vh" }}>
        <Globe
          ref={globeEl}
          backgroundColor="rgba(0, 0, 0, 1)"
          backgroundImageUrl={null}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          polygonsData={geoData.features}
          polygonCapColor={() => "rgba(0, 150, 255, 0.3)"}
          polygonSideColor={() => "rgba(0, 150, 255, 0.1)"}
          polygonStrokeColor={() => "#111"}
          onPolygonClick={handleCountryClick}
          labelsData={places}
          labelLat={(d) => d.properties.latitude}
          labelLng={(d) => d.properties.longitude}
          labelText={(d) => d.properties.name}
          labelSize={(d) => Math.sqrt(d.properties.pop_max) * 4e-4}
          labelDotRadius={(d) => Math.sqrt(d.properties.pop_max) * 4e-4}
          labelColor={() => "#b0740c"}
          labelResolution={2}
          pointsData={locations}
          pointLat={(d) => d.coord.lat}
          pointLng={(d) => d.coord.lon}
          pointColor={() => category.color}
          pointAltitude={0.08}
          pointRadius={0.4}
          onPointClick={(point) => {
            setSelectedPreview(point);
          }}
          {...options}
        />
      </div>
    </div>
  );
}
