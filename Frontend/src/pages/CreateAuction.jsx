import { useState } from "react";
import { UploadCloud, ImagePlus } from "lucide-react";

export default function CreateAuction() {
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    category: "Electronics",
    condition: "Brand New",
    startingBid: "",
    reservePrice: "",
    endDate: "",
    description: "",
  });

  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    const preview = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    setImages(preview);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0B101A] text-white">

      {/* Background */}

      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">

        <div className="absolute -top-40 -left-40 h-[550px] w-[550px] rounded-full bg-violet-600/10 blur-[170px]" />

        <div className="absolute top-1/2 -right-40 h-[450px] w-[450px] rounded-full bg-blue-600/10 blur-[170px]" />

      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">

        <div className="mb-10">

          <h1 className="text-5xl font-bold">
            Create Auction
          </h1>

          <p className="mt-3 text-slate-400 text-lg">
            Create a beautiful auction listing in minutes.
          </p>

        </div>

        <div className="grid xl:grid-cols-[360px_1fr] gap-8">

          {/* Upload Card */}

          <div className="rounded-3xl border border-slate-800 bg-[#111827]/70 backdrop-blur-xl p-6 h-fit">

            <h2 className="text-2xl font-bold">
              Product Images
            </h2>

            <p className="mt-2 text-slate-400">
              Upload up to 5 images.
            </p>

            <label
              htmlFor="images"
              className="mt-8 flex h-72 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-700 hover:border-violet-500 transition"
            >

              <UploadCloud
                size={55}
                className="text-violet-400"
              />

              <h3 className="mt-5 text-lg font-semibold">
                Upload Images
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                JPG • PNG • JPEG
              </p>

            </label>

            <input
              hidden
              id="images"
              multiple
              type="file"
              onChange={handleImages}
            />

            <div className="grid grid-cols-3 gap-3 mt-6">

              {images.map((img, index) => (

                <img
                  key={index}
                  src={img.url}
                  alt=""
                  className="h-24 w-full rounded-xl object-cover border border-slate-700"
                />

              ))}

            </div>

          </div>

          {/* Form Starts */}

          <div className="rounded-3xl border border-slate-800 bg-[#111827]/70 backdrop-blur-xl p-8">

            <h2 className="text-2xl font-bold">
              Product Details
            </h2>

            <p className="text-slate-400 mt-2">
              Fill the information below.
            </p>

            <div className="mt-8 space-y-6">
                {/* Product Name */}

<div>
  <label className="block text-sm font-medium text-slate-300 mb-2">
    Product Name
  </label>

  <input
    type="text"
    name="title"
    value={formData.title}
    onChange={handleChange}
    placeholder="e.g. iPhone 15 Pro Max"
    className="w-full rounded-2xl border border-slate-700 bg-[#0B101A]/70 px-5 py-4 outline-none transition-all focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20"
  />
</div>

{/* Category + Condition */}

<div className="grid md:grid-cols-2 gap-6">

  <div>
    <label className="block text-sm font-medium text-slate-300 mb-2">
      Category
    </label>

    <select
      name="category"
      value={formData.category}
      onChange={handleChange}
      className="w-full rounded-2xl border border-slate-700 bg-[#0B101A]/70 px-5 py-4 outline-none focus:border-violet-500"
    >
      <option>Electronics</option>
      <option>Mobiles</option>
      <option>Laptops</option>
      <option>Gaming</option>
      <option>Fashion</option>
      <option>Furniture</option>
      <option>Accessories</option>
    </select>
  </div>

  <div>
    <label className="block text-sm font-medium text-slate-300 mb-2">
      Condition
    </label>

    <select
      name="condition"
      value={formData.condition}
      onChange={handleChange}
      className="w-full rounded-2xl border border-slate-700 bg-[#0B101A]/70 px-5 py-4 outline-none focus:border-violet-500"
    >
      <option>Brand New</option>
      <option>Like New</option>
      <option>Excellent</option>
      <option>Good</option>
      <option>Fair</option>
    </select>
  </div>

</div>

{/* Pricing */}

<div className="grid md:grid-cols-2 gap-6">

  <div>
    <label className="block text-sm font-medium text-slate-300 mb-2">
      Starting Bid
    </label>

    <input
      type="number"
      name="startingBid"
      value={formData.startingBid}
      onChange={handleChange}
      placeholder="₹10,000"
      className="w-full rounded-2xl border border-slate-700 bg-[#0B101A]/70 px-5 py-4 outline-none focus:border-violet-500"
    />
  </div>

  <div>
    <label className="block text-sm font-medium text-slate-300 mb-2">
      Reserve Price
    </label>

    <input
      type="number"
      name="reservePrice"
      value={formData.reservePrice}
      onChange={handleChange}
      placeholder="Optional"
      className="w-full rounded-2xl border border-slate-700 bg-[#0B101A]/70 px-5 py-4 outline-none focus:border-violet-500"
    />
  </div>

</div>

{/* End Date */}

<div>
  <label className="block text-sm font-medium text-slate-300 mb-2">
    Auction End Date
  </label>

  <input
    type="datetime-local"
    name="endDate"
    value={formData.endDate}
    onChange={handleChange}
    className="w-full rounded-2xl border border-slate-700 bg-[#0B101A]/70 px-5 py-4 outline-none focus:border-violet-500"
  />
</div>

{/* Description */}

<div>
  <label className="block text-sm font-medium text-slate-300 mb-2">
    Description
  </label>

  <textarea
    rows={6}
    name="description"
    value={formData.description}
    onChange={handleChange}
    placeholder="Write a detailed description..."
    className="w-full rounded-2xl border border-slate-700 bg-[#0B101A]/70 px-5 py-4 outline-none resize-none focus:border-violet-500"
  />
</div>
            </div>
            {/* Live Preview */}
{/* Action Buttons */}

<div className="mt-10 flex flex-col sm:flex-row justify-end gap-4">

  <button
    type="button"
    className="rounded-2xl border border-slate-700 px-8 py-4 font-medium hover:border-violet-500 hover:bg-violet-500/5 transition"
  >
    Save Draft
  </button>

  <button
    type="submit"
    className="rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-10 py-4 font-semibold text-white hover:scale-[1.02] transition-all duration-300 shadow-[0_0_30px_rgba(124,58,237,0.25)]"
  >
    Publish Auction
  </button>

</div>

          </div>
        </div>
      </div>
    </div>
  );
}