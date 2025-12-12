"use client";
import React, { useEffect, useState, useRef } from "react";
import ImageModal from "./ImageModal";

export default function ProductImage({
  id,
  src,
  alt,
}: {
  id: number | string;
  src?: string;
  alt?: string;
}) {
  const [open, setOpen] = useState(false);
  const prevUrlRef = useRef<string | null>(null);

  useEffect(() => {
    function onPop() {
      setOpen(false);
    }

    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  function openModal() {
    prevUrlRef.current =
      window.location.pathname + window.location.search + window.location.hash;
    const imageUrl = `/product-list/${id}/image`;
    window.history.pushState({}, "", imageUrl);
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
    if (prevUrlRef.current) {
      window.history.replaceState({}, "", prevUrlRef.current);
      prevUrlRef.current = null;
    }
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className="max-w-full rounded-lg cursor-pointer"
        onClick={openModal}
      />

      {open && (
        <ImageModal onClose={closeModal}>
          <div className="flex flex-col items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} className="max-w-full" />
            <div className="mt-3">
              <a
                href={`/product-list/${id}/image`}
                className="text-sm underline text-gray-700"
              >
                Otwórz na osobnej stronie
              </a>
            </div>
          </div>
        </ImageModal>
      )}
    </>
  );
}
