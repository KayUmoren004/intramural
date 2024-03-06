// Format school list

import { School } from "@/lib/types/entities";

export const formatSchoolList = (schoolList: School[]) => {
  const list = schoolList.map((school: School) => {
    return {
      label: school.name,
      value: school.domain.domain,
    };
  });
  return list;
};
