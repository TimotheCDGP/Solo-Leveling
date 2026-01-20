import { Link, Navigate } from "react-router-dom";
import { ArrowRight, Target, Trophy, Shield, Rocket, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export default function Landing() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      
      {/* --- HEADER --- */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2" to="/">
          <Trophy className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Hunter App</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link to="/login">
            <Button variant="ghost">Connexion</Button>
          </Link>
          <Link to="/register">
            <Button>S'inscrire</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-muted/40">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center gap-3 flex-wrap">
                  Level Up Your Life 
                  <Sparkles className="h-10 w-10 md:h-14 md:w-14 text-blue-600 animate-pulse" />
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Ne vous contentez pas de rêver. Gérez vos objectifs, suivez vos progrès et devenez le héros de votre propre histoire.
                </p>
              </div>
              <div className="space-x-4 pt-4">
                <Link to="/register">
                  <Button size="lg" className="h-12 px-8 text-lg gap-2 shadow-lg">
                    Commencer l'aventure <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="h-12 px-8 text-lg">
                    J'ai déjà un compte
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Pourquoi devenir un Hunter ?
              </h2>
              <p className="text-muted-foreground mt-4 text-lg">
                Tout ce dont vous avez besoin pour accomplir votre destinée.
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4 bg-primary/10 rounded-full text-primary">
                  <Target className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold">Objectifs Clairs</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Définissez des cibles précises, fixez des deadlines et suivez votre avancement en temps réel.
                </p>
              </div>

              <div className="flex flex-col items-center space-y-4 text-center p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4 bg-primary/10 rounded-full text-primary">
                  <Shield className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold">Habitudes Solides</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Construisez une discipline de fer. Transformez vos actions quotidiennes en routine incassable.
                </p>
              </div>

              <div className="flex flex-col items-center space-y-4 text-center p-6 border rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4 bg-primary/10 rounded-full text-primary">
                  <Rocket className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold">Progression continue</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Visualisez votre montée en puissance. Chaque tâche accomplie vous rapproche du Rang S.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-8 w-full shrink-0 items-center px-4 md:px-6 border-t bg-muted/20">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2026 Hunter App. Design inspiré par Sung Jin Woo.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Conditions d'utilisation
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" to="#">
            Confidentialité
          </Link>
        </nav>
      </footer>
      <div className="fixed bottom-4 right-4 lg:bottom-8 lg:right-8">
            <ModeToggle />
        </div>
    </div>
  );
}