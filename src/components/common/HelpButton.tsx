import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const HelpButton = () => {
  const handleClick = () => {
    // TODO: Display help image when clicked
    console.log("Help button clicked");
  };

  return (
    <Button
      onClick={handleClick}
      size="icon"
      className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full shadow-elevated hover:shadow-glow transition-all duration-300"
      aria-label="Help"
    >
      <HelpCircle className="h-6 w-6" />
    </Button>
  );
};

export default HelpButton;
