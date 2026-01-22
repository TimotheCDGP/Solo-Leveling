"use client"

import * as React from "react"
import { useAuth } from "@/contexts/AuthContext"
import { UserService } from "@/services/user.service"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { 
  Trophy, Target, Zap, Calendar, Mail, Edit2, Save, 
  ShieldCheck, TrendingUp, Lock, Camera, X, CheckCircle2 
} from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { toast } from "sonner"

interface ProfileSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileSheet({ open, onOpenChange }: ProfileSheetProps) {
  const { user, updateUser } = useAuth()
  const [stats, setStats] = React.useState<any>(null)
  
  const [isEditing, setIsEditing] = React.useState(false)
  const [editData, setEditData] = React.useState({
    name: user?.name || "",
    avatar: user?.avatar || "",
    password: "",
    confirmPassword: ""
  })

  React.useEffect(() => {
    if (open) {
      UserService.getProfileStats().then(setStats)
      setEditData({ 
        name: user?.name || "", 
        avatar: user?.avatar || "", 
        password: "", 
        confirmPassword: "" 
      })
    }
  }, [open, user])

  const handleUpdate = async () => {
    if (editData.password !== editData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas !")
      return
    }

    try {
      const payload = { 
        name: editData.name, 
        avatar: editData.avatar,
        ...(editData.password ? { password: editData.password } : {})
      }
      
      await updateUser(payload)
      setIsEditing(false)
      toast.success("Profil mis à jour, Hunter.")
    } catch (error) {
      toast.error("Erreur lors de la mise à jour.")
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="p-0 w-full sm:max-w-[50vw] h-full overflow-y-auto border-l border-border/60 bg-white">
        
        <div className="relative h-48 sm:h-64 w-full bg-[url('https://i.pinimg.com/1200x/cb/41/e9/cb41e9a62a67d07d9000a08d3ad58d3c.jpg')] bg-[position:50%_70%] bg-[size:cover]">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          
          <div className="absolute -bottom-14 left-10 flex items-end gap-6">
            <div 
              className="relative group cursor-pointer" 
              onClick={() => setIsEditing(true)}
            >
              <Avatar className="h-32 w-32 sm:h-44 sm:w-44 rounded-3xl border-[8px] border-white shadow-2xl bg-white overflow-hidden transition-transform group-hover:scale-[1.02]">
                <AvatarImage src={editData.avatar} className="object-cover" />
                <AvatarFallback className="text-4xl rounded-3xl bg-slate-100 font-black">{user?.name?.[0]}</AvatarFallback>
              </Avatar>
              
              <div className="absolute inset-0 bg-black/40 rounded-3xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <Camera className="text-white h-8 w-8 mb-2" />
                <span className="text-white text-[10px] font-black uppercase tracking-tighter">Modifier</span>
              </div>
            </div>
            
            <div className="pb-6 hidden sm:block">
              <Badge className="text-xl px-5 py-1.5 italic font-black uppercase tracking-tighter shadow-lg" style={{ backgroundColor: stats?.rankColor || '#6366f1' }}>
                Rang {stats?.rank || 'E'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-20 px-10 space-y-10 pb-12">
          
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1 w-full max-w-md">
                {isEditing ? (
                  <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400">Nom du Hunter</label>
                      <Input value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} className="text-xl font-black italic uppercase bg-slate-50 border-slate-200" />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400">URL de l'Avatar</label>
                      <Input value={editData.avatar} onChange={(e) => setEditData({...editData, avatar: e.target.value})} className="text-xs font-mono bg-slate-50 border-slate-200" placeholder="https://..." />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400">Nouveau Mot de Passe</label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                          <Input type="password" value={editData.password} onChange={(e) => setEditData({...editData, password: e.target.value})} className="pl-10 bg-slate-50 border-slate-200" placeholder="••••••••" />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400">Confirmer</label>
                        <div className="relative">
                          <CheckCircle2 className={`absolute left-3 top-2.5 h-4 w-4 ${editData.password && editData.password === editData.confirmPassword ? 'text-emerald-500' : 'text-slate-400'}`} />
                          <Input type="password" value={editData.confirmPassword} onChange={(e) => setEditData({...editData, confirmPassword: e.target.value})} className="pl-10 bg-slate-50 border-slate-200" placeholder="••••••••" />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleUpdate} className="bg-slate-900 hover:bg-slate-800 flex-1 gap-2 font-bold uppercase text-xs tracking-widest h-11">
                        <Save className="h-4 w-4" /> Sauvegarder
                      </Button>
                      <Button onClick={() => setIsEditing(false)} variant="outline" className="gap-2 font-bold uppercase text-xs tracking-widest h-11">
                        <X className="h-4 w-4" /> Annuler
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 group">
                      <h2 className="text-4xl font-black italic tracking-tighter uppercase text-slate-900">{user?.name}</h2>
                      <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-purple-600 transition-colors">
                        <Edit2 className="h-5 w-5" />
                      </Button>
                    </div>
                    <p className="text-slate-500 font-medium flex items-center gap-2">
                      <Mail className="h-4 w-4" /> {user?.email}
                    </p>
                  </>
                )}
              </div>

              {!isEditing && (
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 shadow-sm">
                  <Calendar className="h-4 w-4" />
                  Éveillé : {stats?.createdAt ? format(new Date(stats.createdAt), "dd MMM yyyy", { locale: fr }) : "..."}
                </div>
              )}
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* STATS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatBox label="Puissance (XP)" value={stats?.totalXP?.toLocaleString() || "0"} icon={<Zap className="size-4 text-amber-500 fill-amber-500/20" />} footerBold="Gain constant" footerSub="Niveau d'énergie totale" trend="Niveau" />
            <StatBox label="Missions" value={stats?.totalGoals || "0"} icon={<Target className="size-4 text-indigo-500 fill-indigo-500/20" />} footerBold="Objectifs actifs" footerSub="Missions entreprises" trend="Acceptées" />
            <StatBox label="Succès" value={stats?.completedGoals || "0"} icon={<Trophy className="size-4 text-emerald-500 fill-emerald-500/20" />} footerBold="Missions finies" footerSub="Rapport de réussite" trend="100%" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function StatBox({ label, value, icon, footerBold, footerSub, trend }: any) {
  return (
    <Card className="relative overflow-hidden border border-border/60 bg-gradient-to-t from-primary/5 to-card shadow-sm transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardDescription className="flex items-center gap-2 font-black uppercase text-[10px] tracking-widest text-slate-400">
          {icon} {label}
        </CardDescription>
        <CardTitle className="text-3xl font-black italic tracking-tighter text-slate-900 tabular-nums">{value}</CardTitle>
        <div className="absolute right-4 top-4">
          <Badge variant="outline" className="gap-1 bg-background/50 backdrop-blur-sm text-[10px] font-bold px-2 py-0">
            <TrendingUp className="size-3 text-emerald-500" /> {trend}
          </Badge>
        </div>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 pt-0 text-[10px]">
        <div className="flex items-center gap-1.5 font-bold uppercase tracking-tight text-slate-900">{footerBold}</div>
        <div className="text-muted-foreground italic font-medium">{footerSub}</div>
      </CardFooter>
    </Card>
  )
}