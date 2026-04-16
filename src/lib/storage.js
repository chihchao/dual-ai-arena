const KEY = 'gemini_api_key'

export const getApiKey = () => localStorage.getItem(KEY)
export const setApiKey = (key) => localStorage.setItem(KEY, key)
export const clearApiKey = () => localStorage.removeItem(KEY)
