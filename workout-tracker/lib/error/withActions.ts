import { handleActionError, ActionResult } from './actionErrorHandler'

type ActionFn<TArgs extends unknown[], TData> = (
  ...args: TArgs
) => Promise<ActionResult<TData>>

export function withAction<TArgs extends unknown[], TData>(
  fn: (...args: TArgs) => Promise<TData>,
): ActionFn<TArgs, TData> {
  return async (...args: TArgs): Promise<ActionResult<TData>> => {
    try {
      const data = await fn(...args)
      return { success: true, data }
    } catch (err) {
      return handleActionError(err)
    }
  }
}
