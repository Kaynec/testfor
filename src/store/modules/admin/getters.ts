import { GetterTree } from 'vuex';
import { RootState } from '@/store';
import { State } from './state';
import { UserDocuments } from '@/@types';

export type Getters = {
  getUserToken(state: State): string | null;
  getCurrentUser(state: State): UserDocuments | null;
};

export const getters: GetterTree<State, RootState> & Getters = {
  getUserToken: (state) => {
    return state.token;
  },
  getCurrentUser: (state) => {
    return state.user;
  }
};
