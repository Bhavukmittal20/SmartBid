import { ArrowUpRight, Trophy } from "lucide-react";

const bids = [
  {
    id: 1,
    user: "Bhavuk",
    amount: "₹72,000",
    time: "Just Now",
    highest: true,
  },
  {
    id: 2,
    user: "Aman",
    amount: "₹70,500",
    time: "2 min ago",
  },
  {
    id: 3,
    user: "Rahul",
    amount: "₹69,000",
    time: "5 min ago",
  },
  {
    id: 4,
    user: "Priyansh",
    amount: "₹67,500",
    time: "8 min ago",
  },
  {
    id: 5,
    user: "Harsh",
    amount: "₹66,000",
    time: "12 min ago",
  },
];

export default function BidHistory() {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#111827]/70 backdrop-blur-xl p-6">

      {/* Heading */}

      <div className="flex items-center justify-between">

        <h2 className="text-2xl font-bold">
          Bid History
        </h2>

        <span className="text-sm text-slate-400">
          {bids.length} Bids
        </span>

      </div>

      {/* Timeline */}

      <div className="mt-8 space-y-5 max-h-[500px] overflow-y-auto pr-2">

        {bids.map((bid) => (

          <div
            key={bid.id}
            className={`rounded-2xl border p-5 transition

            ${
              bid.highest
                ? "border-violet-500 bg-violet-500/10"
                : "border-slate-800 hover:border-violet-500"
            }

            `}
          >

            <div className="flex justify-between items-start">

              <div className="flex items-center gap-4">

                {/* Avatar */}

                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 flex items-center justify-center font-bold">

                  {bid.user.charAt(0)}

                </div>

                <div>

                  <h3 className="font-semibold">
                    {bid.user}
                  </h3>

                  <p className="text-sm text-slate-400">
                    {bid.time}
                  </p>

                </div>

              </div>

              <div className="text-right">

                <h2 className="text-xl font-bold text-violet-400">

                  {bid.amount}

                </h2>

                {bid.highest && (

                  <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-500/10 px-3 py-1 text-xs text-green-400">

                    <Trophy size={14} />

                    Highest Bid

                  </div>

                )}

              </div>

            </div>

            {!bid.highest && (

              <button className="mt-4 flex items-center gap-2 text-sm text-slate-400 hover:text-violet-400 transition">

                <ArrowUpRight size={15} />

                Outbid this offer

              </button>

            )}

          </div>

        ))}

      </div>

    </div>
  );
}