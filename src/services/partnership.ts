import api from "@/lib/axios/instance";

export interface PartnershipApplicationRequest {
  company: string;
  phone: string;
  email: string;
  fullName: string;
  country: string;
}

export interface PartnershipApplicationResponse {
  id: number;
  createdTime: string;
  company: string;
  fullName: string;
  country: string;
  phone: string;
  email: string;
}

export async function submitPartnershipApplication(
  data: PartnershipApplicationRequest,
): Promise<PartnershipApplicationResponse> {
  const response = await api.post<PartnershipApplicationResponse>(
    "/api/v1/partnership-applications/submit",
    data,
  );
  return response.data;
}
