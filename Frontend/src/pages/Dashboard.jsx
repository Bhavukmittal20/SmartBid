import { Bell, ChevronRight, Plus, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import AuctionCard from "../components/AuctionCard";
import { useAuth } from "../context/authContext";
import socket from "../utils/socket";

export default function Dashboard() {
  const { user } = useAuth();
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [bidStats, setBidStats] = useState({ totalBids: 0, activeBids: 0 });

  useEffect(() => {
    const controller = new AbortController();
    const loadAuctions = async () => {
      try {
        const [auctionResponse,statsResponse] = await Promise.all([
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auctions`, { credentials: "include", signal: controller.signal }),
          fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/bids/stats`, { credentials: "include", signal: controller.signal })
        ]);
        const [auctionResult,statsResult] = await Promise.all([auctionResponse.json(),statsResponse.json()]);
        if (!auctionResponse.ok || !auctionResult.success) throw new Error(auctionResult.message || "Unable to load auctions");
        setAuctions(auctionResult.data.auctions);
        if (statsResponse.ok && statsResult.success) setBidStats(statsResult.data);
      } catch (requestError) {
        if (requestError.name !== "AbortError") setError(requestError.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    loadAuctions();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const handleAuctionUpdate = async (update) => {
      setAuctions((current) => current.map((auction) => String(auction._id) === String(update.auctionId) ? { ...auction, currentBid: update.currentBid, bidCount: update.bidCount } : auction));
      if(String(update.bid?.owner?._id||update.bid?.owner)===String(user?._id)){
        try{
          const response=await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/bids/stats`,{credentials:"include"});
          const result=await response.json();
          if(response.ok&&result.success) setBidStats(result.data);
        }catch{
          // The next dashboard load will retry the statistics request.
        }
      }
    };
    const handleAuctionCreated = (auction) => setAuctions((current) => current.some((item) => String(item._id) === String(auction._id)) ? current : [auction, ...current]);
    socket.connect();
    socket.on("auction:updated", handleAuctionUpdate);
    socket.on("auction:created", handleAuctionCreated);
    return () => {
      socket.off("auction:updated", handleAuctionUpdate);
      socket.off("auction:created", handleAuctionCreated);
      socket.disconnect();
    };
  }, [user?._id]);

  const matchingAuctions = useMemo(() => auctions.filter((auction) => auction.productName.toLowerCase().includes(search.toLowerCase())), [auctions, search]);
  const liveAuctions = matchingAuctions.filter((auction) => auction.status === "Open").slice(0, 3);
  const myAuctions = matchingAuctions.filter((auction) => String(auction.seller?._id || auction.seller) === String(user?._id)).slice(0, 3);

  const myAuctionCount=auctions.filter((auction)=>String(auction.seller?._id||auction.seller)===String(user?._id)).length;
  const liveAuctionCount=auctions.filter((auction)=>auction.status==="Open").length;
  const stats = [
    { title: "Total Bids", value: bidStats.totalBids, color: "from-violet-500 to-purple-600" },
    { title: "Active Bids", value: bidStats.activeBids, color: "from-emerald-500 to-green-600" },
    { title: "My Auctions", value: myAuctionCount, color: "from-orange-500 to-amber-500" },
    { title: "Live Auctions", value: liveAuctionCount, color: "from-cyan-500 to-sky-600" },
  ];
  const navigate=useNavigate()
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0B101A] text-slate-200 p-6 lg:p-12">
      
      {/* Background Glows (Wapas add kar diye hain) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[140px]" />
        <div className="absolute top-1/3 -right-20 w-[450px] h-[450px] rounded-full bg-blue-600/15 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 w-[350px] h-[350px] rounded-full bg-fuchsia-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto space-y-12">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white">Welcome Back 👋</h1>
            <p className="text-slate-400 mt-2">Manage your bids and discover premium auctions.</p>
          </div>
<div className="flex flex-wrap items-center gap-3">

  {/* Search */}
  <div className="flex items-center bg-[#111827]/70 border border-slate-800 rounded-2xl px-4 py-3 w-full md:w-[350px] backdrop-blur-sm">
    <Search className="text-slate-500" size={18} />
    <input
      value={search}
      onChange={(event) => setSearch(event.target.value)}
      className="bg-transparent outline-none ml-3 w-full text-sm text-white"
      placeholder="Search auctions..."
    />
  </div>

  {/* Notification */}
  <button className="p-4 border border-slate-800 rounded-2xl bg-[#111827]/70 hover:border-violet-500 hover:bg-violet-500/10 transition-all duration-300">
    <Bell size={20} />
  </button>

  {/* Create Auction */}
  <button className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-4 font-semibold text-white hover:scale-105 hover:shadow-[0_0_25px_rgba(124,58,237,0.35)] transition-all duration-300" onClick={()=>navigate('/create-auction')}>
    <Plus size={18} />
    <span>Create Auction</span>
  </button>

</div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item) => (
            <div
              key={item.title}
              className="relative overflow-hidden bg-[#111827]/70 border border-slate-800 p-6 rounded-3xl hover:border-slate-700 transition-all"
            >
              <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${item.color}`} />
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mt-2">{item.title}</p>
              <h2 className="text-3xl font-bold mt-2 text-white">{item.value}</h2>
            </div>
          ))}
        </div>

        {error && <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">{error}</div>}
        <AuctionPreview title="Live Auctions" auctions={liveAuctions} loading={loading} empty="No live auctions available." onViewAll={() => navigate('/auction?view=live')} />
        <AuctionPreview title="My Auctions" auctions={myAuctions} loading={loading} empty="You have not created any auctions yet." onViewAll={() => navigate('/auction?view=mine')} />
      </div>
    </div>
  );
}

function AuctionPreview({ title, auctions, loading, empty, onViewAll }) {
  return <section>
    <div className="mb-6 flex items-center justify-between gap-4">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      <button onClick={onViewAll} className="flex items-center gap-1 text-sm font-semibold text-violet-300 transition hover:text-violet-200">View all <ChevronRight size={17} /></button>
    </div>
    {loading ? <p className="py-12 text-center text-slate-400">Loading auctions...</p> : auctions.length ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{auctions.map((auction) => <AuctionCard key={auction._id} auction={auction} />)}</div> : <div className="rounded-3xl border border-dashed border-slate-700 py-12 text-center text-slate-400">{empty}</div>}
  </section>;
}
