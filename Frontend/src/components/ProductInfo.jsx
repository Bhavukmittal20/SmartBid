import {
  BadgeCheck,
  Clock3,
  Gavel,
  Tag,
} from "lucide-react";
import { useState } from "react";

export default function ProductInfo() {
  const [bid, setBid] = useState("");

  return (
    <div className="space-y-6">

      {/* Title */}

      <div>

        <h1 className="text-4xl font-bold text-white">
          iPhone 15 Pro Max
        </h1>

        <p className="mt-2 text-slate-400">
          Apple • 256 GB • Natural Titanium
        </p>

      </div>

      {/* Badges */}

      <div className="flex flex-wrap gap-3">

        <span className="rounded-full border border-green-500 bg-green-500/10 px-4 py-1 text-sm text-green-400">
          ● Live
        </span>

        <span className="rounded-full border border-slate-700 px-4 py-1 text-sm">
          Electronics
        </span>

        <span className="rounded-full border border-violet-500 bg-violet-500/10 px-4 py-1 text-sm text-violet-400">
          Premium
        </span>

      </div>

      {/* Current Bid */}

      <div className="rounded-3xl border border-slate-800 bg-[#111827]/70 p-6">

        <p className="text-slate-400">
          Current Bid
        </p>

        <h2 className="mt-2 text-5xl font-bold text-violet-400">
          ₹72,000
        </h2>

        <div className="mt-5 flex items-center justify-between text-sm">

          <div className="flex items-center gap-2 text-slate-400">
            <Gavel size={16} />
            <span>24 Bids</span>
          </div>

          <div className="flex items-center gap-2 text-orange-400">
            <Clock3 size={16} />
            <span>2h 14m Left</span>
          </div>

        </div>

      </div>

      {/* Place Bid */}

      <div className="rounded-3xl border border-slate-800 bg-[#111827]/70 p-6">

        <label className="text-sm text-slate-400">
          Enter Your Bid
        </label>

        <input
          type="number"
          placeholder="₹ 75,000"
          value={bid}
          onChange={(e) => setBid(e.target.value)}
          className="mt-4 w-full rounded-2xl border border-slate-700 bg-[#0B101A] px-5 py-4 outline-none focus:border-violet-500"
        />

        <button
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 font-semibold hover:scale-[1.02] transition"
        >
          <Gavel size={18} />
          Place Bid
        </button>

      </div>

      {/* Description */}

      <div className="rounded-3xl border border-slate-800 bg-[#111827]/70 p-6">

        <h3 className="flex items-center gap-2 text-xl font-semibold">

          <BadgeCheck className="text-violet-400" />

          Description

        </h3>

        <p className="mt-4 leading-8 text-slate-400">

          Experience the power of the Apple A17 Pro chip with a premium titanium
          body, advanced triple-camera system, and stunning Super Retina XDR
          display. The device is in excellent condition with minimal signs of
          use and includes the original box and accessories.

        </p>

      </div>

      {/* Extra Info */}

      <div className="rounded-3xl border border-slate-800 bg-[#111827]/70 p-6">

        <h3 className="flex items-center gap-2 text-xl font-semibold">

          <Tag className="text-violet-400" />

          Product Details

        </h3>

        <div className="mt-5 space-y-4">

          <div className="flex justify-between">
            <span className="text-slate-400">Brand</span>
            <span>Apple</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Condition</span>
            <span>Excellent</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Storage</span>
            <span>256 GB</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-400">Color</span>
            <span>Natural Titanium</span>
          </div>

        </div>

      </div>

    </div>
  );
}