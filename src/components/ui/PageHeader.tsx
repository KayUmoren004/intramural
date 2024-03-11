// import { cn } from "@/lib/utils";
// import { useRef } from "react";
// import { View, Text, Dimensions } from "react-native";
// import { getDefaultHeaderHeight } from "@react-navigation/elements";
// import {
//   useSafeAreaFrame,
//   useSafeAreaInsets,
// } from "react-native-safe-area-context";
// import Animated, {
//   Easing,
//   useSharedValue,
//   withTiming,
//   useAnimatedScrollHandler,
//   interpolate,
//   useAnimatedStyle,
//   Extrapolation,
// } from "react-native-reanimated";

// import { SafeAreaView } from "react-native-safe-area-context";
// import useColor from "@/lib/colors/useColors";

type PageHeaderProps = {
  children: React.ReactNode;
  className?: string;
  title: React.ReactNode;
};

import useColor from "@/lib/colors/useColors";
// const PageHeader: React.FC<PageHeaderProps> = ({
//   children,
//   className,
//   title,
// }) => {
//   const { bottom, top, right, left } = useSafeAreaInsets();

//   const scrollY = useSharedValue(0);
//   const scrollClamp = useSharedValue(0);
//   // const headerHeight - Anima

//   const scrollHandler = useAnimatedScrollHandler({
//     onScroll: (event: any, ctx: any) => {
//       // event.contentOffset.y = scrollY.value;
//       scrollY.value = event.contentOffset.y;

//       scrollClamp.value = clamp(scrollClamp.value, 0, 50);
//     },
//     onBeginDrag: (event: any, ctx: any) => {
//       ctx.prevY = event.contentOffset.y;
//     },
//   });

//   const clamp = (value: any, lowerBound: any, upperBound: any) => {
//     "worklet";
//     return Math.min(Math.max(lowerBound, value), upperBound);
//   };

//   const animatedStyles = useAnimatedStyle(() => {
//     const headerHeight = interpolate(
//       scrollClamp.value,
//       [0, 50],
//       [50, 0],
//       "clamp"
//     );

//     const headerTranslateY = interpolate(
//       scrollClamp.value,
//       [0, 50],
//       [0, -50],
//       "clamp"
//     );

//     const headerOpacity = interpolate(
//       scrollClamp.value,
//       [0, 50],
//       [1, 0],
//       "clamp"
//     );

//     return {
//       height: headerHeight,
//       transform: [{ translateY: headerTranslateY }],
//       opacity: headerOpacity,
//     };
//   });

//   return (
//     <SafeAreaView className="flex flex-1 bg-primary-light dark:bg-primary-dark">
//       <Animated.View
//         className={cn("flex flex-row justify-between items-center px-4")}
//         style={[animatedStyles]}
//       >
//         <Text className="text-text-light dark:text-text-dark text-2xl">
//           {title}
//         </Text>
//       </Animated.View>
//       <Animated.ScrollView
//         showsVerticalScrollIndicator={false}
//         bounces={false}
//         style={{ flex: 1 }}
//         scrollEventThrottle={5}
//         onScroll={scrollHandler}
//       >
//         {children}
//       </Animated.ScrollView>
//     </SafeAreaView>
//   );
// };

// export default PageHeader;

// const PageHeader: React.FC<PageHeaderProps> = ({
//   children,
//   className,
//   title,
// }) => {
//   const width = Dimensions.get("window").width;
//   const scrollY = useSharedValue(0);
//   const scrollHandler = useAnimatedScrollHandler((event) => {
//     scrollY.value = event.contentOffset.y;
//   });
//   const headerStyles = useAnimatedStyle(() => {
//     return {
//       height: interpolate(
//         scrollY.value,
//         [0, 200],
//         [60, 30],
//         Extrapolation.CLAMP
//       ),
//       marginBottom: interpolate(
//         scrollY.value,
//         [0, 200],
//         [20, 5],
//         Extrapolation.CLAMP
//       ),
//     };
//   });
//   const textStyles = useAnimatedStyle(() => {
//     return {
//       fontSize: interpolate(
//         scrollY.value,
//         [0, 200],
//         [34, 16],
//         Extrapolation.CLAMP
//       ),
//       alignSelf: "center",
//       marginTop: interpolate(
//         scrollY.value,
//         [0, 100, 200],
//         [20, 10, 5],
//         Extrapolation.CLAMP
//       ),
//       marginLeft: interpolate(
//         scrollY.value,
//         [0, 100, 200],
//         [0, -width / 4.5, -width / 2],
//         Extrapolation.CLAMP
//       ),
//     };
//   });

//   const colors = useColor();
//   const backgroundColor = colors.BACKGROUND;
//   const primaryColor = colors.PRIMARY;

//   return (
//     <>
//       {/* <SafeAreaView
//         edges={["top"]}
//         style={{ flex: 0, backgroundColor: primaryColor }}
//       /> */}

//       <Animated.View
//         className="bg-primary-light dark:bg-primary-dark"
//         style={headerStyles}
//       >
//         <Animated.Text style={textStyles}>
//           I am an animated header
//         </Animated.Text>
//       </Animated.View>
//       <Animated.ScrollView
//         scrollEventThrottle={1}
//         onScroll={scrollHandler}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{
//           backgroundColor: backgroundColor,
//           // flexGrow: 1,
//         }}
//       >
//         {children}
//       </Animated.ScrollView>
//     </>
//   );
// };

// export default PageHeader;

import React from "react";
import { Dimensions, SafeAreaView, StyleSheet, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const width = Dimensions.get("window").width;

const Home = ({ children, className, title }: PageHeaderProps): JSX.Element => {
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const { BACKGROUND, PRIMARY, TEXT } = useColor();

  const headerStyles = useAnimatedStyle(() => {
    return {
      height: interpolate(
        scrollY.value,
        [0, 200],
        [300, 0],
        Extrapolation.CLAMP
      ),
      marginBottom: interpolate(
        scrollY.value,
        [0, 200],
        [20, 5],
        Extrapolation.CLAMP
      ),
      backgroundColor: PRIMARY,
    };
  });

  // const textStyles = useAnimatedStyle(() => {
  //   return {
  //     fontSize: interpolate(
  //       scrollY.value,
  //       [0, 200],
  //       [34, 16],
  //       Extrapolation.CLAMP
  //     ),
  //     alignSelf: "center",
  //     marginTop: interpolate(
  //       scrollY.value,
  //       [0, 100, 200],
  //       [20, 10, 5],
  //       Extrapolation.CLAMP
  //     ),
  //     marginLeft: interpolate(
  //       scrollY.value,
  //       [0, 100, 200],
  //       [0, -width / 4.5, -width / 2],
  //       Extrapolation.CLAMP
  //     ),
  //   };
  // });

  const textStyles = useAnimatedStyle(() => {
    return {
      // fontSize: interpolate(
      //   scrollY.value,
      //   [0, 200],
      //   [34, 16],
      //   Extrapolation.CLAMP
      // ),
      opacity: interpolate(
        scrollY.value,
        [0, 100, 200],
        [1, 0.5, 0],
        Extrapolation.CLAMP
      ),
      alignSelf: "center",
      marginTop: interpolate(
        scrollY.value,
        [0, 100, 200],
        [20, 10, 5],
        Extrapolation.CLAMP
      ),
      marginLeft: interpolate(
        scrollY.value,
        [0, 100, 200],
        [0, -width / 4.5, -width / 2],
        Extrapolation.CLAMP
      ),
    };
  });

  return (
    <>
      <SafeAreaView style={{ flex: 0, backgroundColor: PRIMARY }} />
      <SafeAreaView
        style={[
          {
            backgroundColor: BACKGROUND,
          },
          styles.container,
        ]}
      >
        <Animated.View style={headerStyles}>
          <Animated.View style={textStyles}>{title}</Animated.View>
        </Animated.View>
        <Animated.ScrollView
          scrollEventThrottle={1}
          onScroll={scrollHandler}
          contentContainerStyle={{
            flexGrow: 1,
            backgroundColor: BACKGROUND,
            alignItems: "center",
          }}
          showsVerticalScrollIndicator={false}
        >
          <View>{children}</View>
        </Animated.ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    alignItems: "center",
  },
  block: {
    height: 100,
    width: 100,
    backgroundColor: "black",
    marginBottom: 30,
  },
});

export default Home;
