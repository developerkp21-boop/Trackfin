const guardFlag = import.meta.env.VITE_ENABLE_AUTH_GUARD

export const ENABLE_AUTH_GUARD =
  guardFlag === undefined ? true : String(guardFlag).toLowerCase() === 'true'
