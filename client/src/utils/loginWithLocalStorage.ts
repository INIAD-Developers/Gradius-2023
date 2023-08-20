import type { UserId } from 'commonTypesWithClient/branded';
import { userIdParser } from './../../../server/service/idParsers';

export const getUserIdFromLocalStorage = (): UserId | null => {
  const userId = localStorage.getItem('userId');
  if (userId !== null) {
    return userIdParser.parse(userId);
  }
  return null;
};
export const loginWithLocalStorage = (userId: UserId) => {
  if (localStorage.getItem('userId') !== null) {
    throw new Error('User is already logged in');
  }
  localStorage.setItem('userId', userId);
};

export const logoutWithLocalStorage = () => {
  localStorage.clear();
};
