"use client"

import { useEffect, useState } from "react";
import { BadgeService, type UserBadge } from "@/services/badges.service";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Lock, Award, Sparkles, Sword, Flame, 
  Footprints, Shield, Zap, Target 
} from "lucide-react";
import { cn } from "@/lib/utils";

const IconMap: Record<string, any> = {
  Sword: Sword,
  Sparkles: Sparkles,
  Flame: Flame,
  Footprints: Footprints,
  Shield: Shield,
  Zap: Zap,
  Target: Target,
  Award: Award,
};

export function BadgesGallery() {
  const [unlockedBadges, setUnlockedBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    BadgeService.getMyBadges()
      .then((data) => {
        if (isMounted) setUnlockedBadges(data);
      })
      .catch((err) => console.error("Erreur badges:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false };
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl bg-white/5 border border-white/10" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h2 className="text-2xl font-oswald font-black uppercase italic tracking-tighter text-foreground flex items-center gap-2">
          <Award className="text-amber-500 h-6 w-6" /> Archives des Succès
        </h2>
        <span className="text-[10px] font-black bg-amber-500 text-black px-2 py-1 rounded italic uppercase tracking-tighter">
          {unlockedBadges.length} Hunter Rewards
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {unlockedBadges.map((ub) => {
          const BadgeIcon = IconMap[ub.badge.icon] || Sparkles;

          return (
            <div 
              key={ub.id}
              className={cn(
                "relative group overflow-hidden rounded-xl p-4 flex flex-col items-center text-center transition-all duration-300",
                "bg-[#0f172a] border border-amber-500/40 shadow-[0_0_20px_rgba(236,173,41,0.05)]",
                "hover:border-amber-500 hover:shadow-[0_0_25px_rgba(236,173,41,0.15)] hover:-translate-y-1"
              )}
            >
              <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-45 group-hover:animate-[shimmer_2s_infinite] pointer-events-none" />

              <div className="relative z-10 bg-amber-500/10 p-4 rounded-2xl mb-3 ring-1 ring-amber-500/30 group-hover:ring-amber-500/60 transition-all">
                <BadgeIcon className="h-8 w-8 text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
              </div>

              <h4 className="relative z-10 text-[11px] font-black uppercase tracking-widest text-white mb-1 italic font-oswald">
                {ub.badge.name}
              </h4>
              <p className="relative z-10 text-[9px] text-slate-400 font-medium leading-tight h-6 line-clamp-2">
                {ub.badge.description}
              </p>
            </div>
          );
        })}
        
        {unlockedBadges.length < 4 && Array.from({ length: 4 - unlockedBadges.length }).map((_, i) => (
          <div key={`locked-${i}`} className="bg-slate-950/40 border border-white/5 rounded-xl p-4 flex flex-col items-center opacity-30 grayscale">
            <div className="p-4 rounded-2xl mb-3 border border-dashed border-white/10 text-slate-600">
              <Lock className="h-8 w-8" />
            </div>
            <div className="h-2 w-16 bg-slate-800 rounded-full mb-2" />
            <div className="h-1.5 w-12 bg-slate-900 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}