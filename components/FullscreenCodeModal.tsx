import { useState } from "react";
import { useCodeModal } from "./CodeModalContext";
import { Dialog, DialogContent, DialogClose, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useSpring, animated } from "react-spring";
import { HighlightedCode } from "./HighlightedCode";
import { Copy, Check } from "lucide-react";

export function FullscreenCodeModal() {
  const { isOpen, closeModal, code, language } = useCodeModal();
  const [copied, setCopied] = useState(false);

  const style = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? "scale(1)" : "scale(0.97)",
    config: { tension: 270, friction: 20 },
  });

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent className="max-w-3xl w-[90vw] max-h-[90vh] p-6 bg-background border border-border rounded-lg shadow-lg"
      maxWidth="3xl"
      >
        <DialogTitle />
        <animated.div style={style}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-mono text-muted-foreground capitalize">{language}</span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Copy code to clipboard"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span className="text-xs">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="text-xs">Copy</span>
                  </>
                )}
              </Button>
              <DialogClose/>
                
            </div>
          </div>
          <div className="relative bg-muted rounded-md p-4 overflow-auto max-h-[70vh]">
            <HighlightedCode code={code} language={language} />
          </div>
        </animated.div>
      </DialogContent>
    </Dialog>
  );
}