import { requests } from "../../config/agent";
import { User } from "../../lib/types/entities";

type UploadImage = {
  body: FormData;
  userId: string;
};

export const user = {
  getUser: (id: string): Promise<User> => requests.get<any>(`/user/${id}`),
  updateUserPhoto: (data: FormData, userId: string): Promise<any> =>
    requests.post<any>(`/user/${userId}/photo`, data),
};
