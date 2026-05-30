import Image from "next/image";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/brand/lambdata.png";

interface LambdataLogoProps {
  size?: "sm" | "md" | "lg" | "splash";
  showText?: boolean;
  className?: string;
  priority?: boolean;
}

const imageSizes = {
  sm: { width: 140, height: 56, className: "h-9 w-auto" },
  md: { width: 180, height: 72, className: "h-11 w-auto" },
  lg: { width: 220, height: 88, className: "h-14 w-auto" },
  splash: { width: 300, height: 120, className: "h-24 w-auto sm:h-28" },
};

export function LambdataLogo({
  size = "md",
  showText = false,
  className,
  priority = false,
}: LambdataLogoProps) {
  const dim = imageSizes[size];

  return (
    <div className={cn("flex items-center", className)}>
      <Image
        src={LOGO_SRC}
        alt="Lambdata"
        width={dim.width}
        height={dim.height}
        className={cn("object-contain object-left", dim.className)}
        priority={priority}
      />
      {showText && (
        <span className="sr-only">Lambdata</span>
      )}
    </div>
  );
}
