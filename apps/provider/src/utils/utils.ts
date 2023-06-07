
type RequestOptions = {
	url: string
	method: string
	body?: {}
}

export async function request(url: string, { method, body }: { method: string, body: {} }) {
	try {
		const options: RequestOptions = { url, method }

		if (method.toLowerCase() != "get")
			options.body = body;

		const response = await fetch(options as RequestInfo);
		const data = await response.json();

		// if(!data.success) throw new Error(data.error);
		return data;
	} catch (error: any) {
		throw new Error(error.message);
	}
}

