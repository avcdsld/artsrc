import { atom } from 'recoil';

export const walletState = atom({
  key: 'walletState',
  default: {
    loggedIn: false,
    addr: '',
  },
});
