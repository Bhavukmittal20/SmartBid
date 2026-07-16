import { Heart, Clock, Gavel } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function AuctionCard({ auction }) {
  const navigate = useNavigate();

  const [liked, setLiked] = useState(false);
  const getTimeLeft = useCallback(() => {
    if (!auction.endDate) return auction.endsIn || "Not specified";
    const difference = new Date(auction.endDate) - new Date();
    if (difference <= 0) return "Ended";
    const days = Math.floor(difference / 86400000);
    const hours = Math.floor((difference % 86400000) / 3600000);
    const minutes = Math.floor((difference % 3600000) / 60000);
    return `${days ? `${days}d ` : ""}${hours}h ${minutes}m`;
  }, [auction.endDate, auction.endsIn]);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [getTimeLeft]);

  return (
    <div
      onClick={() => navigate(`/auction/${auction._id || auction.id}`, { state: { auction } })}
      className="group cursor-pointer overflow-hidden rounded-3xl border border-slate-800 bg-[#111827]/70 backdrop-blur-xl hover:border-violet-500 hover:-translate-y-2 hover:shadow-[0_0_25px_rgba(124,58,237,0.18)] transition-all duration-300"
    >
      {/* Image */}
      <div className="relative overflow-hidden">

        <img
          src={auction.images?.[0] || auction.image}
          alt={auction.productName || auction.title}
          className="h-60 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Live Badge */}
        <div className="absolute top-4 left-4 rounded-full bg-green-500/20 border border-green-500 px-3 py-1 text-xs font-semibold text-green-400">
          ● LIVE
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center"
        >
          <Heart
            size={18}
            className={
              liked
                ? "fill-red-500 text-red-500"
                : "text-white"
            }
          />
        </button>

      </div>

      {/* Content */}

      <div className="p-6">

        <h2 className="text-xl font-bold text-white">
          {auction.productName || auction.title}
        </h2>

        <p className="mt-1 text-sm text-slate-400">
          {auction.category}
        </p>

        {/* Current Bid */}

        <div className="mt-6 flex justify-between">

          <div>

            <p className="text-sm text-slate-500">
              Current Bid
            </p>

            <h3 className="mt-1 text-2xl font-bold text-violet-400">
              ₹{auction.currentBid.toLocaleString()}
            </h3>

          </div>

          <div className="text-right">

            <p className="text-sm text-slate-500">
              Total Bids
            </p>

            <h3 className="mt-1 text-xl font-semibold">
              {auction.bidCount ?? auction.bids?.length ?? auction.bids ?? 0}
            </h3>

          </div>

        </div>

        {/* Seller */}

        <div className="mt-5 flex items-center justify-between">

          <span className="text-sm text-slate-400">
            Seller
          </span>

          <span className="font-medium text-white">
            {auction.seller?.fullname || auction.seller || "Seller"}
          </span>

        </div>

        {/* Timer */}

        <div className="mt-6 flex items-center justify-between">

          <div className="flex items-center gap-2 text-orange-400">

            <Clock size={18} />

            <span className="font-medium">
              {timeLeft}
            </span>

          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/auction/${auction._id || auction.id}`, { state: { auction } });
            }}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2.5 font-medium hover:scale-105 transition"
          >
            <Gavel size={16} />

            Bid Now
          </button>

        </div>

      </div>
    </div>
  );
}
