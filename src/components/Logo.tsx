import { Link } from "react-router-dom";
interface LogoProps {
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}
export function Logo({
  showText = true,
  size = "md"
}: LogoProps) {
  const iconSizes = {
    sm: "h-5 w-5",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  };
  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };
  return <Link to="/" className="flex items-center gap-2 group">
      
      {showText && <span className={`font-bold ${textSizes[size]} text-foreground`}>fyp25098
        </span>}
    </Link>;
}