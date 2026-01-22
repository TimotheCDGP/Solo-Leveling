import * as React from "react";
import { Plus } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { CreateGoalForm } from "@/components/goals/CreateGoalForm";

export function ResponsiveGoalDialog({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleSuccess = () => {
    setOpen(false);
    onSuccess();
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Nouvel Objectif
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Créer un nouvel objectif</DialogTitle>
            <DialogDescription>
              Définissez votre but pour ordinateur.
            </DialogDescription>
          </DialogHeader>
          {/* On passe le handleSuccess au formulaire */}
          <CreateGoalForm onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>

        <Button>
          <Plus className="mr-2 h-4 w-4" /> Nouvel Objectif
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Nouvel Objectif</DrawerTitle>
          <DrawerDescription>
            Remplissez les infos ci-dessous.
          </DrawerDescription>
        </DrawerHeader>
        
        {/* Ajout d'un padding pour que le formulaire respire sur mobile */}
        <div className="px-4 pb-4">
          <CreateGoalForm onSuccess={handleSuccess} />
        </div>

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Annuler</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}