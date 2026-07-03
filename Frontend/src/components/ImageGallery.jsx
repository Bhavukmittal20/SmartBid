import { useState } from "react";

const images = [
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200",
  "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=1200",
  "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=1200",
  "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=1200",
];

export default function ImageGallery() {
  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="space-y-5">

      {/* Main Image */}

      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-[#111827]/70">

        <img
          src={selectedImage}
          alt=""
          className="h-[520px] w-full object-cover transition duration-300 hover:scale-105"
        />

      </div>

      {/* Thumbnails */}

      <div className="grid grid-cols-4 gap-4">

        {images.map((img, index) => (

          <button
            key={index}
            onClick={() => setSelectedImage(img)}
            className={`overflow-hidden rounded-2xl border transition

            ${
              selectedImage === img
                ? "border-violet-500"
                : "border-slate-800 hover:border-violet-500"
            }

            `}
          >

            <img
              src={img}
              className="h-24 w-full object-cover"
            />

          </button>

        ))}

      </div>

    </div>
  );
}