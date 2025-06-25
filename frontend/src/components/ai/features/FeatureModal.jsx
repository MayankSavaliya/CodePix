import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../components/ui/dialog";
import { Button } from "../../ui/button";
import { X } from "lucide-react";

export default function FeatureModal({ 
  isOpen, 
  onClose, 
  title, 
  description,
  icon: Icon,
  color,
  children 
}) {
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-neutral-900/90 backdrop-blur border-neutral-800 text-white max-w-2xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center flex-shrink-0`}>
                <Icon className="h-4 w-4 text-white" />
              </div>
            )}
            <div>
              <DialogTitle className="text-lg font-semibold text-white">{title}</DialogTitle>
              {description && (
                <DialogDescription className="text-sm text-neutral-400">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-neutral-400 hover:text-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <div className="mt-2">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
