import { Bell, Plus, Search } from "lucide-react";
import LiveAuction from "../components/LiveAuction";

export default function Dashboard() {
  const stats = [
    { title: "Active Bids", value: "24", color: "from-violet-500 to-purple-600" },
    { title: "Won Auctions", value: "08", color: "from-emerald-500 to-green-600" },
    { title: "Watchlist", value: "31", color: "from-orange-500 to-amber-500" },
    { title: "Money Saved", value: "₹1.24L", color: "from-cyan-500 to-sky-600" },
  ];

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

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-[#111827]/70 border border-slate-800 rounded-2xl px-4 py-3 w-full md:w-[350px] backdrop-blur-sm">
              <Search className="text-slate-500" size={18} />
              <input
                className="bg-transparent outline-none ml-3 w-full text-sm text-white"
                placeholder="Search auctions..."
              />
            </div>
            <button className="p-4 border border-slate-800 rounded-2xl bg-[#111827]/70 hover:border-violet-500 transition-all">
              <Bell size={20} />
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

        <LiveAuction />
      </div>
    </div>
  );
}