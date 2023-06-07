type RequestOptions = {
  withCredentials?: boolean,
  method: string,
  body: any
}

const BASE_URL = 'http://localhost:3000';

export async function request(url: string, { method, body, withCredentials }: RequestOptions) {
  try {
    url = `${BASE_URL ?? ""}${url}`
    const options: RequestInit = { method }

    if (method.toLowerCase() != "get")
      options.body = body;

    if (withCredentials) {
      const token = '';
      options.headers = {
        "Authorization": `Bearer ${token}`
      }
    }

    const response = await fetch(url, options);
    const data = await response.json();

    // if(!data.success) throw new Error(data.error);
    return data;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

