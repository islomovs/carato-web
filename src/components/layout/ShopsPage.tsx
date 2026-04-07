/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { YMaps, Map, Placemark, Clusterer } from "@pbe/react-yandex-maps";
import { fetchAllStores, Store } from "@/services/stores";

// ─── Store List Item ──────────────────────────────────────────────────────────

function StoreItem({
  store,
  selected,
  onClick,
}: {
  store: Store;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="border-b border-[#E3E8EF] cursor-pointer transition-colors"
      style={{
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 16,
        paddingRight: 16,
        background: selected ? "#EEF2F6" : "white",
      }}
    >
      <p style={{ fontWeight: 500, fontSize: 14, lineHeight: "20px" }}>
        {store.name}
      </p>

      <div className="flex items-center gap-[2px] mt-2">
        <Image src="/icons/calendar.svg" alt="hours" width={18} height={18} className="flex-shrink-0" />
        <span style={{ fontWeight: 300, fontSize: 12, lineHeight: "18px", marginLeft: 2 }}>
          {store.workingHours}
        </span>
      </div>

      <div className="flex items-center gap-[2px] mt-1">
        <Image src="/icons/phone.svg" alt="phone" width={18} height={18} className="flex-shrink-0" />
        <span style={{ fontWeight: 300, fontSize: 12, lineHeight: "18px", marginLeft: 2 }}>
          {store.phone}
        </span>
      </div>

      <div className="flex items-start gap-[2px] mt-1">
        <Image src="/icons/marker.svg" alt="location" width={18} height={18} className="flex-shrink-0 mt-[1px]" />
        <span style={{ fontWeight: 300, fontSize: 12, lineHeight: "18px", marginLeft: 2 }}>
          {store.address}
        </span>
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ t }: { t: (k: string) => string }) {
  return (
    <div className="flex flex-col items-center text-center px-[26px]" style={{ paddingTop: 52 }}>
      <Image src="/icons/search-grey.svg" alt="no results" width={80} height={80} />
      <p style={{ fontWeight: 500, fontSize: 20, lineHeight: "28px", marginTop: 12 }}>
        {t("notFound")}
      </p>
      <p style={{ fontWeight: 400, fontSize: 14, lineHeight: "20px", marginTop: 12 }}>
        {t("tryAgain")}
      </p>
    </div>
  );
}

// ─── Yandex Map ───────────────────────────────────────────────────────────────

function StoresMap({
  stores,
  selectedId,
  onSelect,
  isMobile,
}: {
  stores: Store[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  isMobile: boolean;
}) {
  const mapRef = useRef<any>(null);

  // Navigate map to selected store
  useEffect(() => {
    if (!mapRef.current || selectedId === null) return;
    const store = stores.find((s) => s.id === selectedId);
    if (store) {
      mapRef.current.setCenter([store.latitude, store.longitude], 16, {
        duration: 400,
      });
    }
  }, [selectedId, stores]);

  const getMapOptions = () => ({
    copyrightLogoVisible: false,
    copyrightProvidersVisible: false,
    avoidFractionalZoom: true,
    suppressMapOpenBlock: true,
  });

  const rightOffset = isMobile ? 16 : 32;
  const bottomOffset = isMobile ? 16 : undefined;
  const topOffset = isMobile ? undefined : "50%";

  return (
    <div className="relative w-full h-full">
      {/* Zoom controls */}
      <div
        className="absolute z-[999] flex flex-col items-center justify-between bg-white border border-black rounded-md"
        style={{
          width: 36,
          height: 72,
          right: rightOffset,
          bottom: isMobile ? (bottomOffset ?? 0) + 52 : undefined,
          top: topOffset,
          transform: isMobile ? undefined : "translateY(-50%)",
        }}
      >
        <button
          type="button"
          onClick={() => mapRef.current?.setZoom((mapRef.current.getZoom() || 12) + 1)}
          className="flex items-center justify-center text-lg font-bold cursor-pointer"
          style={{ width: 36, height: 36 }}
        >
          +
        </button>
        <button
          type="button"
          onClick={() => mapRef.current?.setZoom((mapRef.current.getZoom() || 12) - 1)}
          className="flex items-center justify-center text-lg font-bold cursor-pointer"
          style={{ width: 36, height: 36 }}
        >
          −
        </button>
      </div>

      {/* My location button */}
      <div
        onClick={() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
              mapRef.current?.setCenter([pos.coords.latitude, pos.coords.longitude], 16);
            });
          }
        }}
        className="absolute z-[999] bg-white flex items-center justify-center border border-black rounded-md cursor-pointer shadow-md active:scale-95 transition-transform"
        style={{
          width: 36,
          height: 36,
          right: rightOffset,
          bottom: isMobile ? bottomOffset : undefined,
          top: topOffset ? `calc(${topOffset} + 80px)` : undefined,
          transform: isMobile ? undefined : "translateY(-50%)",
        }}
      >
        <Image src="/icons/navigation.png" alt="My location" width={24} height={24} />
      </div>

      <YMaps query={{ apikey: "62a8dde9-9abb-4c5a-81c1-67a6bd19e7a8" }}>
        <Map
          className="w-full h-full map"
          defaultState={{
            center: stores.length > 0
              ? [stores[0].latitude, stores[0].longitude]
              : [41.314472, 69.27991],
            zoom: 12,
          }}
          options={getMapOptions()}
          instanceRef={(ref: any) => { if (ref) mapRef.current = ref; }}
        >
          <Clusterer
            options={{
              preset: "islands#blackClusterIcons",
              groupByCoordinates: false,
              clusterIconLayout: "default#pieChart",
            }}
          >
            {stores.map((store) => {
              const isSelected = store.id === selectedId;
              return (
                <Placemark
                  key={store.id}
                  geometry={[store.latitude, store.longitude]}
                  onClick={() => onSelect(store.id)}
                  options={{
                    iconLayout: "default#image",
                    iconImageHref: isSelected
                      ? "/icons/diamond-white.png"
                      : "/icons/diamond.png",
                    iconImageSize: [24, 24],
                    iconImageOffset: [-12, -12],
                    iconShape: {
                      type: "Circle",
                    //   coordinates: [0, 0],
                    //   radius: 20,
                    },
                    // Custom circle background
                    iconContentLayout: undefined,
                    // Use a balloon-less approach with custom layout
                    balloonAutoPan: false,
                    hideIconOnBalloonOpen: false,
                    // Circle marker
                    iconColor: isSelected ? "#000000" : "#ffffff",
                    // strokeColor: "#000000",
                    // strokeWidth: 1,
                    // fillColor: isSelected ? "#000000" : "#ffffff",
                    // Override with custom icon for circle with diamond
                    preset: undefined,
                  }}
                  // Wrap in circle div via iconLayout
                  modules={["geoObject.addon.balloon"]}
                />
              );
            })}
          </Clusterer>
        </Map>
      </YMaps>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ShopsPage() {
  const t = useTranslations("shops");
  const [stores, setStores] = useState<Store[]>([]);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    fetchAllStores().then(setStores).catch(() => setStores([]));
  }, []);

  const filtered = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.address.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (id: number) => {
    setSelectedId(id);
    // Scroll selected item into view in list
    setTimeout(() => {
      const el = listRef.current?.querySelector(`[data-store-id="${id}"]`);
      el?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 100);
  };

  // ── MOBILE ──────────────────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="flex flex-col w-full pb-[52px]">
        {/* Map */}
        <div style={{ height: 508, position: "relative" }}>
          <StoresMap
            stores={filtered}
            selectedId={selectedId}
            onSelect={handleSelect}
            isMobile
          />
        </div>

        {/* Content block */}
        <div style={{ padding: 16 }}>
          <p style={{ fontWeight: 400, fontSize: 24, lineHeight: "34px", marginBottom: 16 }}>
            {t("title")}
          </p>

          {/* Search */}
          <div
            className="flex items-center border border-black rounded-[4px]"
            style={{ padding: 12 }}
          >
            <Image src="/icons/search-grey.svg" alt="search" width={20} height={20} className="flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="flex-1 outline-none bg-transparent ml-3"
              style={{ fontWeight: 400, fontSize: 14, lineHeight: "20px", color: "#697586" }}
            />
          </div>
        </div>

        {/* List */}
        <div ref={listRef}>
          {filtered.length === 0 ? (
            <EmptyState t={t} />
          ) : (
            filtered.map((store) => (
              <div key={store.id} data-store-id={store.id}>
                <StoreItem
                  store={store}
                  selected={selectedId === store.id}
                  onClick={() => handleSelect(store.id)}
                />
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // ── DESKTOP ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex w-full" style={{ height: "100vh" }}>
      {/* Left panel — 381px fixed */}
      <div
        className="flex flex-col flex-shrink-0 border-r border-[#EEF2F6]"
        style={{ width: 381, height: "100vh" }}
      >
        {/* Fixed header: title + search */}
        <div style={{ paddingTop: 52, paddingLeft: 32, paddingRight: 32, paddingBottom: 0 }}>
          <p style={{ fontWeight: 400, fontSize: 28, lineHeight: "40px" }}>
            {t("title")}
          </p>

          <div
            className="flex items-center border border-black rounded-[4px] mt-5"
            style={{ padding: 12, height: 44 }}
          >
            <Image src="/icons/search-grey.svg" alt="search" width={20} height={20} className="flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="flex-1 outline-none bg-transparent ml-3"
              style={{ fontWeight: 400, fontSize: 14, lineHeight: "20px", color: "#697586" }}
            />
          </div>
        </div>

        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto mt-5" ref={listRef}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <EmptyState t={t} />
            </div>
          ) : (
            filtered.map((store) => (
              <div key={store.id} data-store-id={store.id}>
                <StoreItem
                  store={store}
                  selected={selectedId === store.id}
                  onClick={() => handleSelect(store.id)}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right — map fills rest */}
      <div className="flex-1 relative">
        <StoresMap
          stores={filtered}
          selectedId={selectedId}
          onSelect={handleSelect}
          isMobile={false}
        />
      </div>
    </div>
  );
}