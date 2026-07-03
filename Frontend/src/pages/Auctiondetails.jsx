import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import ImageGallery from "../components/ImageGallery";
import ProductInfo from "../components/ProductInfo";
import SellerCard from "../components/SellerCard";
import BidHistory from "../components/BidHistory";

export default function AuctionDetails() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#0B101A] overflow-x-hidden text-white">

      {/* Background Glow */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[550px] h-[550px] rounded-full bg-violet-600/10 blur-[170px]" />
        <div className="absolute top-1/2 -right-40 w-[450px] h-[450px] rounded-full bg-blue-600/10 blur-[170px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {/* Back Button */}

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Hero */}

        <div className="grid lg:grid-cols-5 gap-10 mt-8">

          <div className="lg:col-span-3">
            <ImageGallery />
          </div>

          <div className="lg:col-span-2">
            <ProductInfo />
          </div>

        </div>

        {/* Bottom */}

        <div className="grid lg:grid-cols-3 gap-8 mt-12">

          <div className="lg:col-span-2">
            <BidHistory />
          </div>

          <SellerCard />

        </div>

      </div>

    </div>
  );
}