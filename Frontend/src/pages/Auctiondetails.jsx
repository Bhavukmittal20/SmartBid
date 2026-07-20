import { ArrowLeft } from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import ImageGallery from "../components/ImageGallery";
import AuctionSummary from "../components/AuctionSummary";
import { AuthContext } from "../context/authContext";
import auctions from "../data/auctions";
import socket from "../utils/socket";

const normaliseAuction = (item, id) => ({
  _id: item?._id || item?.id || id,
  productName: item?.productName || item?.title || "Auction item",
  category: item?.category || "Others",
  condition: item?.condition || "Not specified",
  description: item?.description || "No description has been provided.",
  images: item?.images?.length ? item.images : item?.image ? [item.image] : [],
  seller: item?.seller || { fullname: "Seller" },
  startingPrice: Number(item?.startingPrice ?? item?.currentBid ?? 0),
  currentBid: Number(item?.currentBid ?? item?.startingPrice ?? 0),
  endDate: item?.endDate,
  endsIn: item?.endsIn,
  status: item?.endDate && new Date(item.endDate) <= new Date() ? "Completed" : item?.status || "Open",
  bids: Array.isArray(item?.bids) ? item.bids : [],
  winner: item?.winner,
  paymentStatus: item?.paymentStatus || "Unpaid",
  paidAt: item?.paidAt,
  createdAt: item?.createdAt,
});

export default function AuctionDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const demoAuction = auctions.find((item) => String(item.id) === String(id));
  const [auctionData, setAuctionData] = useState(location.state?.auction || demoAuction || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const auction = useMemo(() => normaliseAuction(auctionData, id), [auctionData, id]);
  const sellerId = String(auction.seller?._id || auction.seller || "");
  const userId = String(user?._id || "");
  const isOwner = Boolean(userId && sellerId === userId);
  const isWinner = Boolean(userId && String(auction.winner?._id || auction.winner || "") === userId);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAuction = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auctions/${id}`, {
          method: "GET",
          credentials: "include",
          signal: controller.signal,
        });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || "Unable to load auction");
        setAuctionData(result.data.auction);
      } catch (requestError) {
        if (requestError.name !== "AbortError") setError(requestError.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    fetchAuction();
    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    const handleBidPlaced = (update) => {
      if (String(update.auctionId) !== String(id)) return;
      setAuctionData((current) => {
        if (!current) return current;
        const existingBids = Array.isArray(current.bids) ? current.bids : [];
        const alreadyIncluded = existingBids.some((bid) => String(bid._id) === String(update.bid._id));
        return {
          ...current,
          currentBid: update.currentBid,
          bidCount: update.bidCount,
          bids: alreadyIncluded ? existingBids : [update.bid, ...existingBids],
        };
      });
    };
    const handlePaymentCompleted = (update) => {
      if (String(update.auctionId) !== String(id)) return;
      setAuctionData((current) => current ? { ...current, paymentStatus: update.paymentStatus, paidAt: update.paidAt } : current);
    };

    socket.connect();
    socket.emit("auction:join", id);
    socket.on("bid:placed", handleBidPlaced);
    socket.on("payment:completed", handlePaymentCompleted);

    return () => {
      socket.emit("auction:leave", id);
      socket.off("bid:placed", handleBidPlaced);
      socket.off("payment:completed", handlePaymentCompleted);
      socket.disconnect();
    };
  }, [id]);

  if (loading && !auctionData) {
    return <div className="flex min-h-screen items-center justify-center bg-[#0B101A] text-slate-300">Loading auction details...</div>;
  }

  if (error && !auctionData) {
    return <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#0B101A] px-6 text-center text-white"><h1 className="text-2xl font-bold">Unable to load auction</h1><p className="text-slate-400">{error}</p><button onClick={() => navigate(-1)} className="rounded-xl bg-violet-600 px-5 py-3">Go back</button></div>;
  }

  return (
    <div className="relative min-h-screen bg-[#0B101A] overflow-x-hidden text-white">

      {/* Background Glow */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[550px] h-[550px] rounded-full bg-violet-600/10 blur-[170px]" />
        <div className="absolute top-1/2 -right-40 w-[450px] h-[450px] rounded-full bg-blue-600/10 blur-[170px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">

        {error && <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-5 py-4 text-sm text-amber-200">Showing cached auction data: {error}</div>}

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
            <ImageGallery images={auction.images} productName={auction.productName} />
          </div>

          <div className="lg:col-span-2">
            <AuctionSummary auction={auction} isOwner={isOwner} isWinner={isWinner} />
          </div>

        </div>

      </div>

    </div>
  );
}
