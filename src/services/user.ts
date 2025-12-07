import api from "@/lib/axios/instance";

export interface UserInfo {
  id: number;
  fullName: string;
  phone: string;
  address: string;
  apartmentNumber: string;
  entrance: string;
  floor: string;
}

export async function getUserInfo() {
  const response = await api.get<UserInfo>(`/api/v1/users/info`);

  return response.data;
}
