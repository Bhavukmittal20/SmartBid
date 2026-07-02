import { Clock } from "lucide-react";

const auctions = [
  {
    title:"iPhone 15 Pro",
    bid:"₹72,000",
    time:"2h 15m"
  },
  {
    title:"MacBook Air",
    bid:"₹88,500",
    time:"5h 48m"
  },
  {
    title:"Royal Enfield",
    bid:"₹1,45,000",
    time:"1d 3h"
  }
]

export default function LiveAuctions(){

return(

<div>

<h2 className="text-2xl font-bold text-white mb-6">
Live Auctions
</h2>

<div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">

{
auctions.map((item)=>(
<div
key={item.title}
className="bg-[#111827] rounded-2xl border border-slate-800 p-6 hover:border-violet-500 transition">

<div className="w-full h-44 rounded-xl bg-slate-700 mb-5"/>

<h2 className="text-xl font-semibold text-white">
{item.title}
</h2>

<p className="text-violet-400 text-2xl font-bold mt-3">
{item.bid}
</p>

<div className="flex items-center gap-2 mt-3 text-slate-400">
<Clock size={16}/>
{item.time}
</div>

<button className="mt-6 w-full bg-violet-600 hover:bg-violet-700 h-11 rounded-xl">
Bid Now
</button>

</div>
))
}

</div>

</div>

)

}