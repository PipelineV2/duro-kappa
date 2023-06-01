
export function sendSuccess<T>(res: any, message: string | T, status = 200): Response {
  return res.status(status).json({ status: 'success', message })
}


export function sendError<T>(res: any, message: string | T, status = 200): Response {
  return res.status(status).json({ status: 'error', message })
}

