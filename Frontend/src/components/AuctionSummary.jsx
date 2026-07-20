import { useState } from "react";
import { BadgeCheck, Clock3, CreditCard, Gavel, IndianRupee, ShieldCheck, Tag, UserRound } from "lucide-react";
import { toast } from "react-toastify";

const money = (value = 0) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

export default function AuctionSummary({ auction, isOwner, isWinner }) {
  const [bid, setBid] = useState(auction.currentBid + 500);
  const [submitting, setSubmitting] = useState(false);
  const [startingPayment, setStartingPayment] = useState(false);
  const completed = auction.status === "Completed";
  const sellerName = auction.seller?.fullname || auction.seller || "Seller";
  const ending = auction.endDate ? new Date(auction.endDate).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : auction.endsIn || "Not specified";

  const placeBid = async () => {
    if (Number(bid) <= auction.currentBid) return toast.error(`Bid must exceed ${money(auction.currentBid)}.`);
    try {
      setSubmitting(true);
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/bids`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auctionId: auction._id, amount: Number(bid) }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to place bid");
      setBid(Number(result.data.currentBid) + 500);
      toast.success("Bid placed successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const startPayment = async () => {
    try {
      setStartingPayment(true);
      if (!window.Razorpay) {
        await new Promise((resolve, reject) => {
          const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
          if (existing) existing.remove();
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = resolve;
          script.onerror = () => reject(new Error("Unable to load Razorpay Checkout"));
          document.body.appendChild(script);
        });
      }
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/payments/order`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auctionId: auction._id }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || "Unable to start payment");
      const checkout = new window.Razorpay({
        key: result.data.keyId,
        amount: result.data.amount,
        currency: result.data.currency,
        name: "SmartBid",
        description: result.data.productName,
        order_id: result.data.orderId,
        prefill: result.data.customer,
        theme: { color: "#7c3aed" },
        handler: async (paymentResult) => {
          try {
            const verifyResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/payments/verify`, {
              method: "POST",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(paymentResult),
            });
            const verified = await verifyResponse.json();
            if (!verifyResponse.ok || !verified.success) throw new Error(verified.message || "Payment verification failed");
            toast.success(verified.data.paymentStatus === "Paid" ? "Payment completed" : "Payment received and awaiting capture");
          } catch (error) {
            toast.error(error.message);
          } finally {
            setStartingPayment(false);
          }
        },
        modal: { ondismiss: () => setStartingPayment(false) },
      });
      checkout.open();
    } catch (error) {
      toast.error(error.message);
      setStartingPayment(false);
    }
  };

  return <div className="space-y-5">
    <div>
      <div className="flex flex-wrap gap-2 text-sm">
        <span className="rounded-full bg-violet-500/10 px-3 py-1 text-violet-300">{auction.category}</span>
        <span className={`rounded-full px-3 py-1 ${completed ? "bg-slate-700" : "bg-emerald-500/10 text-emerald-300"}`}>{completed ? "Completed" : "Open"}</span>
        {isOwner && <span className="rounded-full bg-amber-500/10 px-3 py-1 text-amber-300">Your listing</span>}
      </div>
      <h1 className="mt-4 text-4xl font-bold">{auction.productName}</h1>
      <p className="mt-2 flex items-center gap-2 text-slate-400"><UserRound size={17} /> Listed by {sellerName}</p>
    </div>

    <div className="rounded-3xl border border-slate-800 bg-[#111827]/70 p-6">
      <p className="text-sm text-slate-400">{auction.bids.length ? "Current bid" : "Starting price"}</p>
      <p className="mt-2 text-4xl font-bold text-violet-300">{money(auction.currentBid)}</p>
      <div className="mt-5 flex justify-between text-sm text-slate-400"><span className="flex items-center gap-2"><Gavel size={16} /> {auction.bids.length} bids</span><span className="flex items-center gap-2 text-orange-300"><Clock3 size={16} /> {completed ? "Ended" : ending}</span></div>
    </div>

    {isOwner ? <div className="rounded-3xl border border-amber-500/30 bg-amber-500/5 p-6">
      <p className="text-sm font-semibold text-amber-300">Owner interface</p><h2 className="mt-2 text-xl font-semibold">{completed ? "Payment status" : "Manage your auction"}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">{completed ? `Winner payment: ${auction.paymentStatus || "Unpaid"}` : "Monitor bids and status. Buyers see bidding or payment controls here."}</p>
      <button disabled={completed} onClick={() => toast.info("Connect the cancel-auction API to enable this action.")} className="mt-5 w-full rounded-2xl border border-red-500/40 py-4 font-semibold text-red-300 disabled:opacity-40">Cancel auction</button>
    </div> : completed ? <div className={`rounded-3xl border p-6 ${isWinner ? "border-emerald-500/30 bg-emerald-500/5" : "border-slate-800 bg-[#111827]/70"}`}>
      {isWinner ? auction.paymentStatus === "Paid" ? <><BadgeCheck className="text-emerald-400" size={30} /><h2 className="mt-3 text-xl font-semibold">Payment completed</h2><p className="mt-2 text-sm text-slate-400">Your winning purchase has been paid successfully.</p></> : <><BadgeCheck className="text-emerald-400" size={30} /><h2 className="mt-3 text-xl font-semibold">You won this auction</h2><p className="mt-2 text-sm text-slate-400">Complete payment to confirm your purchase.</p><button disabled={startingPayment} onClick={startPayment} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60"><CreditCard size={19} /> {startingPayment ? "Opening checkout..." : `Pay ${money(auction.currentBid)}`}</button><p className="mt-3 flex items-center justify-center gap-2 text-xs text-slate-500"><ShieldCheck size={14} /> Secure payment by Razorpay</p></> : <><Clock3 className="text-slate-400" size={28} /><h2 className="mt-3 text-xl font-semibold">Auction has ended</h2><p className="mt-2 text-sm text-slate-400">Only the winning bidder can make payment.</p></>}
    </div> : <div className="rounded-3xl border border-violet-500/20 bg-violet-500/5 p-6">
      <p className="text-sm font-semibold text-violet-300">Buyer interface</p><label className="mt-4 block text-sm text-slate-400">Your bid</label>
      <div className="relative mt-2"><IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} /><input type="number" value={bid} min={auction.currentBid + 1} onChange={(e) => setBid(e.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-950 py-4 pl-11 pr-4 outline-none focus:border-violet-500" /></div>
      <button disabled={submitting} onClick={placeBid} className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 py-4 font-semibold disabled:cursor-not-allowed disabled:opacity-60"><Gavel size={18} /> {submitting ? "Placing bid..." : "Place bid"}</button>
    </div>}

    <div className="rounded-3xl border border-slate-800 bg-[#111827]/70 p-6"><h2 className="flex items-center gap-2 text-xl font-semibold"><BadgeCheck className="text-violet-400" /> Description</h2><p className="mt-4 leading-7 text-slate-400">{auction.description}</p></div>
    <div className="rounded-3xl border border-slate-800 bg-[#111827]/70 p-6"><h2 className="flex items-center gap-2 text-xl font-semibold"><Tag className="text-violet-400" /> Product details</h2><dl className="mt-5 space-y-4"><Row label="Category" value={auction.category} /><Row label="Condition" value={auction.condition} /><Row label="Starting price" value={money(auction.startingPrice)} /><Row label="Status" value={auction.status} /></dl></div>
  </div>;
}

function Row({ label, value }) { return <div className="flex justify-between gap-4 border-b border-slate-800 pb-4 last:border-0"><dt className="text-slate-400">{label}</dt><dd className="text-right font-medium">{value}</dd></div>; }
