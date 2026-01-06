/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { YMaps, Map } from "@pbe/react-yandex-maps";
import axios from "axios";
import Image from "next/image";

interface YandexMapProps {
  onLocationChange: (e: {
    address: string;
    city: string;
    location: [number, number];
  }) => void;
}

const YandexMap: React.FC<YandexMapProps> = ({ onLocationChange }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [mapInstance, setMapInstance] = useState<any>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMapRef = (map: any) => {
    if (map) {
      setMapInstance(map);
    }
  };

  const getAddress = async (coords: number[]) => {
    try {
      const response = await axios.get(
        `https://geocode-maps.yandex.ru/1.x/?apikey=62a8dde9-9abb-4c5a-81c1-67a6bd19e7a8&geocode=${String(
          coords
        )}&lang=ru_RU&format=json`
      );
      if (response?.data) {
        const geoObject =
          response.data.response.GeoObjectCollection.featureMember[0]
            ?.GeoObject;
        let city = "";
        if (geoObject.metaDataProperty?.GeocoderMetaData?.Address?.Components) {
          for (const item of geoObject.metaDataProperty.GeocoderMetaData.Address
            .Components) {
            if (item.kind === "locality") {
              city = item.name;
            }
          }
        }
        onLocationChange({
          address: geoObject?.name,
          city,
          location: [coords[1], coords[0]],
        });
      }
    } catch (error) {
      console.error("[YandexMap] Error getting address:", error);
    }
  };

  const handleGetLocation = () => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          mapInstance?.setCenter([latitude, longitude], 16);
          getAddress([latitude, longitude]);
        },
        (error) => {
          console.error("[YandexMap] Geolocation error:", error);

          // OPTIONAL: Show an alert instead of moving the map
          alert(
            "Cannot detect your location. Please allow location access or try again."
          );

          // Do NOT move the map, or you can set it to a safer default
          // mapInstance?.setCenter([41.314472, 69.27991], 12);
        },
        { enableHighAccuracy: false, timeout: 20000, maximumAge: 60000 }
      );
    }
  };

  const onBoundsChange = (e: unknown) => {
    const evt = e as { originalEvent?: { newCenter?: [number, number] } };
    const coords = evt.originalEvent?.newCenter;
    if (!coords) return;
    getAddress([coords[1], coords[0]]);
  };
  const getMapOptions = () => ({
    copyrightLogoVisible: false,
    copyrightProvidersVisible: false,
    avoidFractionalZoom: true,
    suppressMapOpenBlock: true,
  });

  return (
    <div
      className={`
    relative
    z-10
    w-full
    touch-manipulation
    select-none
    ${isMobile ? "h-[300px]" : "h-[360px]"}
  `}
    >
      {/* Zoom controls */}
      <div
        className={`absolute z-[999] flex flex-col items-center justify-between bg-white border border-black rounded-md`}
        style={{
          width: 36,
          height: 72,
          bottom: isMobile ? 10 : 64, // distance from top of map
          right: isMobile ? 10 : 16, // align with location button
          padding: 0,
        }}
      >
        {/* Zoom In */}
        <button
          type="button"
          onClick={() =>
            mapInstance?.setZoom((mapInstance.getZoom() || 12) + 1)
          }
          className="w-36 h-36 flex items-center justify-center text-lg font-bold cursor-pointer"
          style={{ width: 36, height: 36 }}
        >
          +
        </button>

        {/* Zoom Out */}
        <button
          type="button"
          onClick={() =>
            mapInstance?.setZoom((mapInstance.getZoom() || 12) - 1)
          }
          className="w-36 h-36 flex items-center justify-center text-lg font-bold cursor-pointer"
          style={{ width: 36, height: 36 }}
        >
          −
        </button>
      </div>

      <div
        onClick={handleGetLocation}
        className={`
      absolute
      z-[999]
      bg-white
      w-9
      h-9
      flex
      items-center
      justify-center
      border border-black
      rounded-md
      p-2
      cursor-pointer
      shadow-md
      transition-transform
      active:scale-95
      ${isMobile ? "bottom-2 right-2" : "bottom-4 right-4"}
    `}
      >
        <Image
          src="/icons/navigation.png"
          alt="Get Location"
          width={24}
          height={24}
          style={{ display: "block" }}
        />
      </div>

      <YMaps query={{ apikey: "62a8dde9-9abb-4c5a-81c1-67a6bd19e7a8" }}>
        <Map
          className="map w-full h-full"
          defaultState={{
            center: [41.314472, 69.27991],
            zoom: isMobile ? 12 : 14,
          }}
          onBoundsChange={onBoundsChange}
          options={getMapOptions()}
          instanceRef={handleMapRef}
        >
          <Image
            src="/icons/location.png"
            alt="Location"
            width={40}
            height={40}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
          />
        </Map>
      </YMaps>
    </div>
  );
};

export default YandexMap;
