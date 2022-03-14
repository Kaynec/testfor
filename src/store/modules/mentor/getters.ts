import { GetterTree } from 'vuex';
import { RootState } from '@/store';
import { State } from './state';
import { UserDocuments } from '@/@types';

export type Getters = {
  getMentorToken(state: State): string | null;
  getCurrentMentor(state: State): UserDocuments | null;
  getCurrentStudentInfoForChat(state: State): UserDocuments | null;
};

export const getters: GetterTree<State, RootState> & Getters = {
  getMentorToken: (state) => {
    return state.token;
  },
  getCurrentMentor: (state) => {
    return state.mentor;
  },
  getCurrentStudentInfoForChat: (state) => {
    return state.currentStudentInfoForChat;
  }
};
