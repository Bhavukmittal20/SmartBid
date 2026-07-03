import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import AuctionCard from "../components/AuctionCard";
import auctions from "../data/auctions";

export default function Auctions() {

  const [search,setSearch]=useState("");
  const [category,setCategory]=useState("All");
  const [sort,setSort]=useState("latest");

  const categories=[
    "All",
    "Electronics",
    "Laptop",
    "Gaming",
    "Camera",
  ];

  const filteredAuctions=useMemo(()=>{

      let data=[...auctions];

      if(category!=="All"){

          data=data.filter(item=>item.category===category);

      }

      if(search){

          data=data.filter(item=>

             item.title.toLowerCase().includes(search.toLowerCase())

          );

      }

      if(sort==="high"){

          data.sort((a,b)=>b.currentBid-a.currentBid);

      }

      if(sort==="low"){

          data.sort((a,b)=>a.currentBid-b.currentBid);

      }

      return data;

  },[search,category,sort]);

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

{

filteredAuctions.map(item=>

<AuctionCard

key={item.id}

auction={item}

/>

)

}

</div>

</div>

</div>

  );

}