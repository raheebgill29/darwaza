import React from 'react';

type HoverInfoOverlayProps = {
  title: string;
  price?: string;
};

export default function HoverInfoOverlay({ title, price }: HoverInfoOverlayProps) {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <h3 className="text-base font-semibold truncate">{title}</h3>
        {price && <p className="mt-1 text-sm">{price}</p>}
      </div>
    </div>
  );
}