import { request } from "@/utils/utils";

export async function onboard() {
	return await request('/onboard', { method: 'post', body: JSON.stringify({}) })
}

