import {
  BadgeCheck,
  Star,
  MapPin,
  Package,
  MessageCircle,
  Phone,
} from "lucide-react";

export default function SellerCard() {
  return (
    <div className="space-y-6">

      {/* Seller Profile */}

      <div className="rounded-3xl border border-slate-800 bg-[#111827]/70 backdrop-blur-xl p-6">

        <div className="flex items-center gap-4">

          <img
            src="https://i.pravatar.cc/150?img=12"
            alt="Seller"
            className="h-16 w-16 rounded-full object-cover border-2 border-violet-500"
          />

          <div>

            <div className="flex items-center gap-2">

              <h2 className="text-xl font-bold">
                Tech Hub
              </h2>

              <BadgeCheck
                size={18}
                className="text-violet-400"
              />

            </div>

            <p className="text-slate-400 text-sm mt-1">
              Verified Seller
            </p>

          </div>

        </div>

        {/* Rating */}

        <div className="mt-6 flex items-center justify-between">

          <div className="flex items-center gap-2">

            <Star
              className="fill-yellow-400 text-yellow-400"
              size={18}
            />

            <span className="font-semibold">
              4.9
            </span>

          </div>

          <span className="text-slate-400">
            1,248 Reviews
          </span>

        </div>

      </div>

      {/* Seller Stats */}

      <div className="rounded-3xl border border-slate-800 bg-[#111827]/70 backdrop-blur-xl p-6">

        <h3 className="text-lg font-semibold mb-5">
          Seller Details
        </h3>

        <div className="space-y-5">

          <div className="flex justify-between">

            <span className="flex items-center gap-2 text-slate-400">

              <Package size={18} />

              Auctions

            </span>

            <span className="font-semibold">
              256
            </span>

          </div>

          <div className="flex justify-between">

            <span className="text-slate-400">
              Successful Sales
            </span>

            <span className="font-semibold">
              240
            </span>

          </div>

          <div className="flex justify-between">

            <span className="text-slate-400">
              Success Rate
            </span>

            <span className="text-green-400 font-semibold">
              97%
            </span>

          </div>

          <div className="flex justify-between">

            <span className="flex items-center gap-2 text-slate-400">

              <MapPin size={18} />

              Location

            </span>

            <span>
              Delhi
            </span>

          </div>

        </div>

      </div>

      {/* Contact Buttons */}

      <div className="rounded-3xl border border-slate-800 bg-[#111827]/70 backdrop-blur-xl p-6">

        <h3 className="text-lg font-semibold mb-5">
          Contact Seller
        </h3>

        <button
          className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 font-semibold hover:scale-[1.02] transition"
        >
          <div className="flex items-center justify-center gap-2">

            <MessageCircle size={18} />

            Chat Now

          </div>

        </button>

        <button
          className="mt-4 w-full rounded-2xl border border-slate-700 py-4 hover:border-violet-500 transition"
        >
          <div className="flex items-center justify-center gap-2">

            <Phone size={18} />

            Contact Seller

          </div>

        </button>

      </div>

    </div>
  );
}