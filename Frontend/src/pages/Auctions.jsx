import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import AuctionCard from "../components/AuctionCard";

export default function Auctions() {

  const [search,setSearch]=useState("");
  const [category,setCategory]=useState("All");
  const [sort,setSort]=useState("latest");
  const [auctions,setAuctions]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");

  useEffect(()=>{
    const controller=new AbortController();
    const loadAuctions=async()=>{
      try{
        setLoading(true);
        const response=await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/auctions`,{credentials:"include",signal:controller.signal});
        const result=await response.json();
        if(!response.ok||!result.success) throw new Error(result.message||"Unable to load auctions");
        setAuctions(result.data.auctions);
        setError("");
      }catch(requestError){
        if(requestError.name!=="AbortError") setError(requestError.message);
      }finally{
        if(!controller.signal.aborted) setLoading(false);
      }
    };
    loadAuctions();
    return()=>controller.abort();
  },[]);

  const categories=useMemo(()=>["All",...new Set(auctions.map((item)=>item.category).filter(Boolean))],[auctions]);

  const filteredAuctions=useMemo(()=>{

      let data=[...auctions];

      if(category!=="All"){

          data=data.filter(item=>item.category===category);

      }

      if(search){

          data=data.filter(item=>

             item.productName.toLowerCase().includes(search.toLowerCase())

          );

      }

      if(sort==="high"){

          data.sort((a,b)=>b.currentBid-a.currentBid);

      }

      if(sort==="low"){

          data.sort((a,b)=>a.currentBid-b.currentBid);

      }

      return data;

  },[auctions,search,category,sort]);

  return(

<div className="min-h-screen bg-[#0B101A] text-white">

<div className="max-w-7xl mx-auto px-6 py-10">

<h1 className="text-5xl font-bold">

Live Auctions

</h1>

<p className="text-slate-400 mt-3">

Discover amazing products and place your bids.

</p>

<div className="flex flex-col lg:flex-row gap-4 mt-10">

<div className="flex-1 flex items-center bg-[#111827] rounded-xl px-4 py-3">

<Search className="text-slate-500"/>

<input

value={search}

onChange={(e)=>setSearch(e.target.value)}

placeholder="Search Auctions..."

className="bg-transparent ml-3 outline-none w-full"

/>

</div>

<select

value={category}

onChange={(e)=>setCategory(e.target.value)}

className="bg-[#111827] rounded-xl px-4 py-3"

>

{

categories.map(item=>

<option key={item}>

{item}

</option>

)

}

</select>

<select

value={sort}

onChange={(e)=>setSort(e.target.value)}

className="bg-[#111827] rounded-xl px-4 py-3"

>

<option value="latest">

Latest

</option>

<option value="high">

Highest Price

</option>

<option value="low">

Lowest Price

</option>

</select>

</div>

<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mt-10">

{loading && <p className="col-span-full py-16 text-center text-slate-400">Loading auctions...</p>}

{error && <p className="col-span-full rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-center text-red-300">{error}</p>}

{

filteredAuctions.map(item=>

<AuctionCard

key={item._id}

auction={item}

/>

)

}

{!loading&&!error&&filteredAuctions.length===0&&<p className="col-span-full py-16 text-center text-slate-400">No auctions found.</p>}

</div>

</div>

</div>

  );

}
