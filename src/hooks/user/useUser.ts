import { useQuery, useMutation } from "@tanstack/react-query";
import { user } from "./user.requests";

// Upload Image Type
export type UploadImageParams = {
  userId: string;
  data: FormData;
};

// Upload Image
export const useUploadImage = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (data: any, variables: any, context: any) => void;
  onError?: (error: any, variables: any, context: any) => void;
}) => {
  return useMutation({
    mutationFn: (newImage: UploadImageParams) =>
      user.updateUserPhoto(newImage.data, newImage.userId),
    onSuccess,
    onError,
  });
};

// Get User
export const useGetUser = (id: string) => {
  if (!id || id === "") {
    return useQuery({
      queryKey: ["user", id],
      queryFn: () => user.getUser(id),
      enabled: false,
    });
  }
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => user.getUser(id),
  });
};
