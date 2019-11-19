export function throttle(fn: Function, delay: number = 500, tail: boolean = false): Function {
  let lastInvoked = +new Date()
  let tailTimeout: number | undefined

  return function(...args: any) {
    const invokingTime = +new Date()
    if (invokingTime - lastInvoked > delay) {
      fn(...args)
      lastInvoked = invokingTime
    } else if (tail) {
      clearTimeout(tailTimeout)
      tailTimeout = setTimeout(fn, Math.max(invokingTime - lastInvoked, 4), ...args)
    }
  }
}
