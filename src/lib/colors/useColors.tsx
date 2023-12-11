import { useColorScheme } from "react-native";
import { LIGHT_COLORS, DARK_COLORS } from "./Colors";
import { useState, useEffect } from "react";

const useColor = () => {
  // Get the current color scheme
  let colorScheme = useColorScheme();

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
