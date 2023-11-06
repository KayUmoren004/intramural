import { useColorScheme } from "nativewind";
import { LIGHT_COLORS, DARK_COLORS } from "./Colors";

const useColor = () => {
  const { colorScheme } = useColorScheme();

  // Return the colors for the current color scheme
  const colors = colorScheme === "dark" ? DARK_COLORS : LIGHT_COLORS;
  return colors;
};

export default useColor;
