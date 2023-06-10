'use client';
type RequestOptions = {
  method: string,
  body?: any
  withCredentials?: boolean,
}

export const DURO_ADMIN = 'duro_admin'
export const DURO_USER = 'duro_user'
export const TOKEN = 'duro_token'
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:7778';

export async function request(url: string, { method, body, withCredentials }: RequestOptions) {
  const storage = new Storage();
  try {
    url = `${BASE_URL ?? ""}${url}`
    const options: RequestInit = { method, headers: { "Content-Type": "application/json" } }

    if (method.toLowerCase() != "get")
      options.body = JSON.stringify(body);

    if (withCredentials) {
      const token = storage.get(TOKEN);
      options.headers = {
        ...options.headers,
        "Authorization": `Bearer ${token ?? ""}`
      }
    }

    const response = await fetch(url, options);
    const data = await response.json();

    //if (response.status === 401) {
    //storage.clear();
    //return null;
    //}

    if (data.status !== 'success') throw new Error(data.message);
    return data;
  } catch (error: any) {
    console.log(error)
    throw new Error(error.message);
  }
}

const localStorage = window.localStorage ?? {};

export class Storage {
  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value))
  }

  get(key: string) {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : null;
  }

  clear() {
    localStorage.clear();
  }

  getMultiple(keys: Array<string>) {
    return keys.map(key => this.get(key))
  }
}

export const is_client = (user: any): boolean => { return !is_admin(user) }

export const is_admin = (user: any): boolean => { return user?.hasOwnProperty('superAdmin') }

export const is_super_admin = (user: any): boolean => { return is_admin(user) && user.superAdmin }

