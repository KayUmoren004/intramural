import { useColorScheme } from "nativewind";
import { LIGHT_COLORS, DARK_COLORS } from "./Colors";
import { useState, useEffect } from "react";

const useColor = () => {
  const { colorScheme } = useColorScheme();

  // Set up state to hold the current colors
  const [colors, setColors] = useState(
    colorScheme === "dark" ? DARK_COLORS : LIGHT_COLORS
  );

  // Update the colors whenever the color scheme changes
  useEffect(() => {
    setColors(colorScheme === "dark" ? DARK_COLORS : LIGHT_COLORS);
  }, [colorScheme]);

  return colors;
};

export default useColor;
