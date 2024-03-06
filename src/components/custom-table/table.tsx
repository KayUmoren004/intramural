import { View, ScrollView, Image } from "react-native";
import Text from "../ui/Text";
import { sporttable } from "@/lib/types/headers";

const CustomTable = () => {
    // Convert sportName to camel case (e.g., "Cross Country" to "crossCountry")
  const sportNameInCamelCase = sportName
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    })
    .replace(/\s+/g, "");

      // Find the correct headers for the sport (camel case keys)
  const header = sportHeaders[sportNameInCamelCase];
  

  const table: sporttable = {
    headers: header,
    teams: getSportData(sportName) ?? [],
  };


  return (
    <View className="w-full">
      {/* Table Header */}
      <View className="flex flex-row justify-between w-full p-2">
        <View className="flex flex-row flex-1">
          <Text className="w-11 text-xs font-bold">
            {data.head.left.pos.label}
          </Text>
          <Text className="flex-1 text-xs font-bold">
            {data.head.left.club.label}
          </Text>
        </View>
        <View className="flex flex-row flex-3 justify-between">
          {Object.values(data.head.right).map((item) => (
            <Text key={item.key} className="text-xs font-bold w-8 text-center">
              {item.label}
            </Text>
          ))}
        </View>
      </View>
      {/* Table Body */}
      <View className="flex flex-col">
        {Object.values(data.body).map((row, index) => (
          <View
            key={index}
            className="flex flex-row justify-between w-full p-2 border-b border-slate-600 dark:border-slate-400"
          >
            <View className="flex flex-row flex-1 items-center">
              <Text className="text-sm w-6 text-center">{row.left.pos}</Text>

              <Text className="flex-1 text-sm ml-5">
                {row.left.club.shortName}
              </Text>
            </View>
            <View className="flex flex-row flex-3 justify-between">
              <Text className="text-sm w-8 text-center">{row.right.pl}</Text>
              <Text className="text-sm w-8 text-center">{row.right.w}</Text>
              <Text className="text-sm w-8 text-center">{row.right.d}</Text>
              <Text className="text-sm w-8 text-center">{row.right.l}</Text>
              <Text className="text-sm w-8 text-center">{row.right.gd}</Text>
              <Text className="text-sm w-8 text-center">{row.right.pts}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default CustomTable;

const FakeData: sporttable = [
    {
    position: 1,
    Team: "FC Awesome",
    stats: {
      GP: 10,
      W: 6,
      T: 2,
      L: 2,
      // "+/-": "20-10",
      GD: 10,
      PTS: 20,
    },
    Form: "W-L-W-W-T",
  },
  {
    position: 2,
    Team: "Eagles United",
    stats: {
      GP: 10,
      W: 5,
      T: 3,
      L: 2,
      // "+/-": "10-5",
      GD: 5,
      PTS: 18,
    },
    Form: "W-T-L-W-T",
  },
  {
    position: 3,
    Team: "River City",
    stats: {
      GP: 10,
      W: 3,
      T: 4,
      L: 3,
      // "+/-": "1-3",
      GD: -1,
      PTS: 13,
    },
    Form: "T-T-W-L-T",
  },
  {
    position: 4,
    Team: "Mountain Rovers",
    stats: {
      GP: 10,
      W: 2,
      T: 5,
      L: 3,
      // "+/-": "10-10",
      GD: 0,
      PTS: 11,
    },
    Form: "T-T-T-W-L",
  },
  {
    position: 5,
    Team: "Seaside FC",
    stats: {
      GP: 10,
      W: 1,
      T: 6,
      L: 3,
      // "+/-": "2-5",
      GD: -3,
      PTS: 9,
    },

    Form: "L-T-T-T-T",
  },
]
  // head: {
  //   left: {
  //     pos: {
  //       key: "pos",
  //       label: "Pos",
  //     },
  //     club: {
  //       key: "club",
  //       label: "Club",
  //     },
  //   },
  //   right: {
  //     pl: {
  //       key: "pl",
  //       label: "PL",
  //     },
  //     w: {
  //       key: "w",
  //       label: "W",
  //     },
  //     d: {
  //       key: "d",
  //       label: "D",
  //     },
  //     l: {
  //       key: "l",
  //       label: "L",
  //     },
  //     gd: {
  //       key: "gd",
  //       label: "GD",
  //     },
  //     pts: {
  //       key: "pts",
  //       label: "PTS",
  //     },
  //   },
  // },
  // body: {
  //   1: {
  //     left: {
  //       pos: 1,
  //       club: {
  //         logo: "",
  //         name: "Chelsea",
  //         shortName: "CHE",
  //       },
  //     },
  //     right: {
  //       pl: 26,
  //       w: 18,
  //       d: 6,
  //       l: 2,
  //       gd: 38,
  //       pts: 60,
  //     },
  //   },
  //   2: {
  //     left: {
  //       pos: 2,
  //       club: {
  //         logo: "",
  //         name: "Liverpool",
  //         shortName: "LIV",
  //       },
  //     },
  //     right: {
  //       pl: 26,
  //       w: 17,
  //       d: 7,
  //       l: 2,
  //       gd: 36,
  //       pts: 58,
  //     },
  //   },
  //   3: {
  //     left: {
  //       pos: 3,
  //       club: {
  //         logo: "",
  //         name: "Manchester City",
  //         shortName: "MCI",
  //       },
  //     },
  //     right: {
  //       pl: 25,
  //       w: 16,
  //       d: 5,
  //       l: 4,
  //       gd: 36,
  //       pts: 53,
  //     },
  //   },
  //   4: {
  //     left: {
  //       pos: 4,
  //       club: {
  //         logo: "",
  //         name: "West Ham United",
  //         shortName: "WHU",
  //       },
  //     },
  //     right: {
  //       pl: 26,
  //       w: 14,
  //       d: 6,
  //       l: 6,
  //       gd: 12,
  //       pts: 48,
  //     },
  //   },
  //   5: {
  //     left: {
  //       pos: 5,
  //       club: {
  //         logo: "",
  //         name: "Tottenham Hotspur",
  //         shortName: "TOT",
  //       },
  //     },
  //     right: {
  //       pl: 25,
  //       w: 13,
  //       d: 6,
  //       l: 6,
  //       gd: 21,
  //       pts: 45,
  //     },
  //   },
  // },
  
}

type Club = {
  logo: string;
  name: string;
  shortName: string;
};

type HeadItem = {
  key: string;
  label: string;
};

type Head = {
  left: {
    [key: string]: HeadItem;
  };
  right: {
    [key: string]: HeadItem;
  };
};

type BodyItem = {
  left: {
    pos: number | string;
    club: Club;
  };
  right: {
    pl: number | string;
    w: number | string;
    d: number | string;
    l: number | string;
    gd: number | string;
    pts: number | string;
  };
};

type Body = {
  [key: number]: BodyItem;
};

type FakeDataType = {
  head: Head;
  body: Body;
};
