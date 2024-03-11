import CustomTable from "@/components/custom-table/table";
import {
  type FixtureType,
  Fixture,
  MiniFixture,
  FixtureScroll,
  ListFixture,
} from "@/components/games/fixtures/fixture-items";
import { ListResult } from "@/components/games/results/result-items";
import {
  ListTable,
  ListTableProps,
} from "@/components/games/tables/table-items";
import CreateTeam from "@/components/school/create-team";
import Table from "@/components/table";
import Loading from "@/components/ui/Loading";
import PageHeader from "@/components/ui/PageHeader";
import {
  buildCaptainFixture,
  buildFixtures,
} from "@/hooks/fixture/fixture-utils";
import { useGetLeagueFixtures } from "@/hooks/fixture/useFixture";
import { useGetLeague } from "@/hooks/league/useLeague";
import useColor from "@/lib/colors/useColors";
import { useSession } from "@/lib/providers/auth-provider";
import { type League, type Team } from "@/lib/types/entities";
import { sportHeaders, sporttable } from "@/lib/types/headers";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { MoveRight } from "lucide-react-native";
import { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  Animated,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { DataTable } from "react-native-paper";

export {
  CustomTable,
  FixtureType,
  Fixture,
  MiniFixture,
  FixtureScroll,
  ListFixture,
  ListResult,
  ListTable,
  ListTableProps,
  CreateTeam,
  Table,
  Loading,
  PageHeader,
  buildCaptainFixture,
  buildFixtures,
  useGetLeagueFixtures,
  useGetLeague,
  useColor,
  useSession,
  League,
  Team,
  sportHeaders,
  sporttable,
  Feather,
  MaterialIcons,
  FlashList,
  Stack,
  useLocalSearchParams,
  useRouter,
  MoveRight,
  useState,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  Animated,
  SafeAreaView,
  Dimensions,
  DataTable,
};
