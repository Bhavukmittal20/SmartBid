import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Armchair, Laptop, Package, Search, Shirt, Smartphone, Watch } from "lucide-react";
import { useNavigate } from "react-router";
import socket from "../utils/socket";

const categoryStyles = {
  Mobiles: { icon: Smartphone, color: "from-blue-500 to-cyan-400" },
  Laptops: { icon: Laptop, color: "from-violet-500 to-fuchsia-500" },
  Faishon: { icon: Shirt, color: "from-pink-500 to-rose-400", label: "Fashion" },
  Fashion: { icon: Shirt, color: "from-pink-500 to-rose-400" },
  Furniture: { icon: Armchair, color: "from-amber-500 to-orange-400" },
  Accessories: { icon: Watch, color: "from-emerald-500 to-teal-400" },
  Others: { icon: Package, color: "from-slate-500 to-slate-300" },
};

export default function Category() {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const loadCategories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auctions`, { credentials: "include", signal: controller.signal });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || "Unable to load categories");
        setAuctions(result.data.auctions);
      } catch (requestError) {
        if (requestError.name !== "AbortError") setError(requestError.message);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    loadCategories();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const handleAuctionCreated = (auction) => setAuctions((current) => current.some((item) => String(item._id) === String(auction._id)) ? current : [auction, ...current]);
    socket.connect();
    socket.on("auction:created", handleAuctionCreated);
    return () => {
      socket.off("auction:created", handleAuctionCreated);
      socket.disconnect();
    };
  }, []);

  const categories = useMemo(() => {
    const counts = auctions.reduce((result, auction) => {
      const key = auction.category || "Others";
      result[key] ||= { name: key, total: 0, live: 0, image: auction.images?.[0] };
      result[key].total += 1;
      if (auction.status === "Open") result[key].live += 1;
      if (!result[key].image) result[key].image = auction.images?.[0];
      return result;
    }, {});
    return Object.values(counts).filter((item) => (categoryStyles[item.name]?.label || item.name).toLowerCase().includes(search.toLowerCase()));
  }, [auctions, search]);

  return <main className="min-h-screen bg-[#0B101A] text-white">
    <div className="mx-auto max-w-7xl px-6 py-12">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-400">Browse smarter</p>
        <h1 className="mt-3 text-4xl font-bold sm:text-6xl">Auction Categories</h1>
        <p className="mt-4 text-lg leading-8 text-slate-400">Find live and upcoming auctions grouped by the products you care about.</p>
      </div>

      <div className="mt-10 flex max-w-xl items-center rounded-2xl border border-slate-800 bg-[#111827] px-5 py-4 focus-within:border-violet-500">
        <Search size={20} className="text-slate-500" />
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search categories..." className="ml-3 w-full bg-transparent outline-none placeholder:text-slate-600" />
      </div>

      {loading && <p className="py-24 text-center text-slate-400">Loading categories...</p>}
      {error && <p className="mt-10 rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-300">{error}</p>}

      {!loading && !error && <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => {
          const style = categoryStyles[category.name] || categoryStyles.Others;
          const Icon = style.icon;
          return <button key={category.name} onClick={() => navigate(`/auction?view=all&category=${encodeURIComponent(category.name)}`)} className="group relative min-h-72 overflow-hidden rounded-3xl border border-slate-800 bg-[#111827] p-7 text-left transition duration-300 hover:-translate-y-1 hover:border-violet-500">
            {category.image && <img src={category.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-15 transition duration-500 group-hover:scale-105 group-hover:opacity-20" />}
            <div className="relative flex h-full flex-col">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${style.color}`}><Icon size={27} /></div>
              <h2 className="mt-8 text-2xl font-bold">{style.label || category.name}</h2>
              <p className="mt-2 text-slate-400">{category.total} {category.total === 1 ? "auction" : "auctions"} · {category.live} live</p>
              <span className="mt-auto flex items-center gap-2 pt-8 text-sm font-semibold text-violet-300">Explore category <ArrowRight size={17} className="transition group-hover:translate-x-1" /></span>
            </div>
          </button>;
        })}
        {!categories.length && <p className="col-span-full py-20 text-center text-slate-400">No categories found.</p>}
      </div>}
    </div>
  </main>;
}
