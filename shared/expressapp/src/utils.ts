
export function sendSuccess<T>(res: any, message: string, opts?: { status?: number, data?: T }): Response {
  const options: { message: string, data?: T, status: string } = { status: 'success', message };
  if (opts?.data)
    options.data = opts.data;
  return res.status(opts?.status ?? 200).json(options)
}

export function sendError<T>(res: any, message: string, opts?: { status?: number, data?: T }): Response {
  const options: { message: string, data?: T, status: string } = { status: 'error', message };
  if (opts?.data)
    options.data = opts.data;
  return res.status(opts?.status ?? 500).json(options)
}

