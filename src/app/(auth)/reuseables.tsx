// Format school list

import { School } from "@/lib/types/entities";
import { Team } from "@/lib/types/entities";

export const formatSchoolList = (schoolList: School[]) => {
  const list = schoolList.map((school: School) => {
    return {
      label: school.name,
      value: school.domain.domain,
    };
  });
  return list;
};

// Format Teams List
export const formatTeamsList = (teams?: Team[]) => {
  const list = teams?.map((team: Team) => {
    return {
      label: team?.name,
      value: team?.id,
    };
  });
  return list;
};
