import { useState } from "react";
import { UploadCloud, X } from "lucide-react";
import { toast } from "react-toastify";

export default function CreateAuction() {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // API call ki loading state
  const [formData, setFormData] = useState({
    title: "",
    category: "Mobiles",
    condition: "Brand New",
    startingBid: "",
    endDate: "",
    description: "",
  });

  const handleImages = (e) => {
    const files = Array.from(e.target.files);

    const preview = files.map((file) => ({
      file, // Original file object for FormData
      url: URL.createObjectURL(file), // Preview ke liye URL
    }));

    setImages((prev) => [...prev, ...preview]);
  };

  const removeImage = (indexToRemove) => {
    URL.revokeObjectURL(images[indexToRemove].url);
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Naya Submit Handler (using Fetch, No Axios)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Page refresh rokne ke liye

    // 1. Validation (Frontend par check kar lo)
    if (images.length < 2 || images.length > 5) {
      toast.warning("Please upload at least 2 and at most 5 images.");
      return;
    }

    if (!formData.title || !formData.startingBid || !formData.endDate) {
      toast.warning("Please fill all the required product details.");
      return;
    }

    setIsLoading(true);

    try {
      // 2. FormData banayein
      const payload = new FormData();

      // State fields ko backend ke names ke sath map kiya
      payload.append("productName", formData.title);
      payload.append("category", formData.category);
      payload.append("condition", formData.condition);
      payload.append("startingPrice", formData.startingBid);
      payload.append("auctionEndDate", formData.endDate);
      payload.append("description", formData.description);

      // 3. Images ko append karein (images key backend ke upload.array('images') se match honi chahiye)
      images.forEach((img) => {
        payload.append("auctionPhotos", img.file);
      });

      // 4. Native Fetch Request
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auctions/create-auction`, {
    method: "POST",
    credentials: "include", // YEH SABSE ZAROORI HAI: Iske bina cookie backend tak nahi jayegi
    body: payload,          // FormData bhej rahe hain, isliye Content-Type khud set ho jayega
});

      const data = await response.json();

      if (response.ok) {
        toast.success("Auction created successfully!");
        // Yahan par aap user ko redirect kar sakte ho ya form clear kar sakte ho
      } else {
        toast.error(data.message || "Failed to create auction");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="text-5xl font-bold">Create Auction</h1>
          <p className="mt-3 text-slate-400 text-lg">
            Create a beautiful auction listing in minutes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid xl:grid-cols-[360px_1fr] gap-8">
          
          {/* Upload Card */}
          <div className="rounded-3xl border border-slate-800 bg-[#111827]/70 backdrop-blur-xl p-6 h-fit">
            <h2 className="text-2xl font-bold">Product Images</h2>
            <p className="mt-2 text-slate-400">Upload up to 5 images.</p>

            <label
              htmlFor="images"
              className="mt-8 flex h-72 cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-700 hover:border-violet-500 transition"
            >
              <UploadCloud size={55} className="text-violet-400" />
              <h3 className="mt-5 text-lg font-semibold">Upload Images</h3>
              <p className="mt-2 text-sm text-slate-500">JPG • PNG • JPEG</p>
            </label>

            <input
              hidden
              id="images"
              multiple
              type="file"
              onChange={handleImages}
              accept="image/*"
            />

            <div className="grid grid-cols-3 gap-3 mt-6">
              {images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img.url}
                    alt=""
                    className="h-24 w-full rounded-xl object-cover border border-slate-700"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form Starts */}
          <div className="rounded-3xl border border-slate-800 bg-[#111827]/70 backdrop-blur-xl p-8">
            <h2 className="text-2xl font-bold">Product Details</h2>
            <p className="text-slate-400 mt-2">Fill the information below.</p>

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
                    <option>Mobiles</option>
                    <option>Laptops</option>
                    <option>Fashion</option>
                    <option>Furniture</option>
                    <option>Accessories</option>
                    <option>Others</option>
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
              </div>

              {/* End Date (UPDATED HERE) */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Auction End Date
                </label>
                <input
                  type="datetime-local" 
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  // showPicker() calendar ko turant open karne ke liye
                  onClick={(e) => e.target.showPicker && e.target.showPicker()} 
                  // [color-scheme:dark] se calendar box dark mode mein khulega
                  className="w-full cursor-pointer rounded-2xl border border-slate-700 bg-[#0B101A]/70 px-5 py-4 outline-none focus:border-violet-500 text-slate-300 [color-scheme:dark]"
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

            {/* Action Buttons */}
            <div className="mt-10 flex flex-col sm:flex-row justify-end gap-4">

              <button
                type="submit"
                disabled={isLoading} 
                className={`rounded-2xl px-10 py-4 font-semibold text-white transition-all duration-300 shadow-[0_0_30px_rgba(124,58,237,0.25)] ${
                  isLoading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:scale-[1.02]"
                }`}
              >
                {isLoading ? "Publishing..." : "Publish Auction"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
