import React, { useState } from "react";
import { GALLERY_ITEMS, GalleryItem } from "../data/dentalData";
import { TypingReveal } from "./TypingReveal";
import { SafeImage } from "./SafeImage";
import { X, ZoomIn } from "lucide-react";

export const GallerySection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const categories = [
    { key: "all", label: "All Photos" },
    { key: "doctor", label: "Doctor / Specialist" },
    { key: "clinic", label: "Clinic Environment" },
    { key: "treatments", label: "Dental Care & Precision" },
  ];

  const filteredItems =
    activeCategory === "all"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Visual Tour</span>
            <span>·</span>
            <span>Mukundapur Clinic</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 font-serif mb-4">
            <TypingReveal text="Clinic & Practice Gallery" speed={20} as="span" />
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            A glimpse into the clinical environment, high-precision endodontic instruments, and welcoming patient spaces at our Mukundapur clinic.
          </p>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat.key
                  ? "bg-teal-700 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightboxItem(item)}
              className="group relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <SafeImage
                  src={item.image}
                  fallbackSrc={item.fallbackImage}
                  alt={item.title}
                  aspectRatioClass="aspect-[4/3]"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Hover overlay with zoom icon and title */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold font-serif">{item.title}</h4>
                    <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                      {item.caption}
                    </p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                    <ZoomIn className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative border border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[70vh] w-full bg-black flex items-center justify-center overflow-hidden">
              <SafeImage
                src={lightboxItem.image}
                fallbackSrc={lightboxItem.fallbackImage}
                alt={lightboxItem.title}
                className="max-h-[70vh] w-full object-contain"
              />
            </div>

            <div className="p-6 text-white bg-slate-900 border-t border-slate-800">
              <h3 className="text-lg font-bold font-serif">{lightboxItem.title}</h3>
              <p className="text-sm text-slate-300 mt-1">{lightboxItem.caption}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
