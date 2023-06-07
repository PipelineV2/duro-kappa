import { request } from "@/utils/utils";
//import

export type RequestOptions<T> = Partial<PostRequestOptions<T>> & {
  body?: T
}

export type PostRequestOptions<T> = {
  body: T
};

export type OnboardMerchant = {
  company_name: string,
  location: string,
  coordinates?: string,
  username: string,
  email: string,
  password: string
}

export type LoginMerchant = Pick<OnboardMerchant, "email" & "password">

async function onboard({ body, ...opts }: PostRequestOptions<OnboardMerchant>) {
  return request('/onboard/merchant', { method: 'post', body, ...opts })
}

async function login_merchant({ body, ...opts }: PostRequestOptions<LoginMerchant>) {
  return request('/onboard/merchant', { method: 'post', body, ...opts })
}

export const apis = {
  onboard,
  login_merchant
}

