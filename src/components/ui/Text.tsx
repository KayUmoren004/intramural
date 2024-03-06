import { cn } from "@/lib/utils";
import { Text as T } from "react-native";

type TextProps = {
  children: any;
  className?: string;
};

const Text = ({ children, className }: TextProps) => {
  return (
    <T className={cn("text-text-light dark:text-text-dark", className)}>
      {children}
    </T>
  );
};

export default Text;
