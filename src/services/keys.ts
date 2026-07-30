export const pageCacheKey = (route: string) => `pagecache#${route}`;
export const userKey = (userId: string) => `users#${userId}`
export const sessionKey = (sessioId: string) => `session#${sessioId}`;
export const itemsKey = (itemId: string) => `items#${itemId}`;
export const usernamesUniqueKey = () => `usernames:unique`
export const userLikesKey = (userId: string) => `users:Likes#${userId}`
export const usernamesKey = () => 'username'