import { toast } from "sonner";
import { Award, Sparkles, X } from "lucide-react";

export const showBadgeUnlock = (badgeName: string) => {
  toast.custom((t) => (
    <div className="bg-slate-950 border-2 border-amber-500 p-4 rounded-xl shadow-[0_0_30px_rgba(236,173,41,0.4)] flex items-center gap-4 animate-in slide-in-from-top-full duration-500 ring-1 ring-amber-400/50">
      <div className="relative bg-amber-500/20 p-3 rounded-full border border-amber-500/50">
        <Award className="h-8 w-8 text-amber-500 animate-pulse" />
        <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-amber-300 animate-bounce" />
      </div>
      <div className="flex-1">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500/80 font-oswald italic">Succès Débloqué</p>
        <h3 className="text-xl font-oswald font-black uppercase italic text-white leading-none mt-0.5 tracking-tight">
          {badgeName}
        </h3>
      </div>
      <button onClick={() => toast.dismiss(t)} className="text-slate-500 hover:text-white transition-colors">
        <X className="h-5 w-5" />
      </button>
    </div>
  ), {
    duration: 6000,
    position: "top-center",
  });
};