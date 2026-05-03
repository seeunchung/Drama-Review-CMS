interface ErrorWithMessage {
  message: string
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  )
}

export function toError(
  error: unknown,
  fallback = '알 수 없는 오류가 발생했습니다.',
): Error {
  if (error instanceof Error) {
    return error
  }

  if (isErrorWithMessage(error)) {
    return new Error(error.message)
  }

  return new Error(fallback)
}

export function getErrorMessage(
  error: unknown,
  fallback = '알 수 없는 오류가 발생했습니다.',
) {
  return toError(error, fallback).message
}
