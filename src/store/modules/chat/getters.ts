import { GetterTree } from 'vuex';
import { RootState } from '@/store';
import { State } from './state';

export type Getters = {
  getMessages(state: State): any[] | null;
};

export const getters: GetterTree<State, RootState> & Getters = {
  getMessages: (state) => {
    return state.messages;
  }
};
