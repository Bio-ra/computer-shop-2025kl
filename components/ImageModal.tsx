"use client";
import React from "react";

export default function ImageModal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        role="button"
        aria-label="Zamknij modal"
      />
      <div className="relative z-10 w-full max-w-3xl p-4">
        <div className="bg-white rounded shadow-lg overflow-hidden">
          <div className="p-2 text-right">
            <button
              onClick={onClose}
              className="text-sm text-gray-700 underline"
            >
              Zamknij
            </button>
          </div>
          <div className="p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
