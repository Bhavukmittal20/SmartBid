import { Clock, Gavel, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const similarAuctions = [
  {
    id: 2,
    title: "MacBook Air M3",
    image:
      "https://images.unsplash.com/photo-1517336714739-489689fd1ca8?w=900",
    bid: "₹89,000",
    time: "5h 20m",
  },
  {
    id: 3,
    title: "Sony PS5",
    image:
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=900",
    bid: "₹39,000",
    time: "1d 4h",
  },
  {
    id: 4,
    title: "Canon EOS R10",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=900",
    bid: "₹65,000",
    time: "6h 10m",
  },
];

export default function SimilarAuctions() {
  const navigate = useNavigate();

  return (
    <div className="mt-16">

      <div className="flex items-center justify-between mb-8">

        <h2 className="text-3xl font-bold text-white">
          Similar Auctions
        </h2>

        <button className="text-violet-400 hover:text-violet-300">
          View All →
        </button>

      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

        {similarAuctions.map((item) => (

          <div
            key={item.id}
            className="group overflow-hidden rounded-3xl border border-slate-800 bg-[#111827]/70 backdrop-blur-xl hover:border-violet-500 hover:-translate-y-2 transition-all duration-300"
          >

            <div className="relative">

              <img
                src={item.image}
                alt={item.title}
                className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
              />

              <button className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/40 backdrop-blur flex items-center justify-center">

                <Heart className="text-white" size={18} />

              </button>

            </div>

            <div className="p-6">

              <h3 className="text-xl font-bold text-white">
                {item.title}
              </h3>

              <div className="mt-5 flex justify-between items-center">

                <div>

                  <p className="text-sm text-slate-500">
                    Current Bid
                  </p>

                  <h2 className="text-2xl font-bold text-violet-400">
                    {item.bid}
                  </h2>

                </div>

                <div className="flex items-center gap-2 text-orange-400">

                  <Clock size={16} />

                  {item.time}

                </div>

              </div>

              <button
                onClick={() => navigate(`/auction/${item.id}`)}
                className="mt-6 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-3 font-semibold flex items-center justify-center gap-2 hover:scale-[1.02] transition"
              >
                <Gavel size={17} />

                Bid Now
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}