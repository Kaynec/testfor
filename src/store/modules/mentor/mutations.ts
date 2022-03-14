import { MutationTree } from 'vuex';

import { Token, UserDocuments } from '@/@types';
import { State } from './state';
import { MentorMutationTypes } from './mutation-types';

export type Mutations<S = State> = {
  [MentorMutationTypes.SET_TOKEN](state: S, payload: Token | null): void;
  [MentorMutationTypes.SET_MENTOR](
    state: S,
    payload: UserDocuments | null
  ): void;
  [MentorMutationTypes.SET_CURRENT_STUDENT_CHAT](
    state: S,
    payload: UserDocuments
  ): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [MentorMutationTypes.SET_TOKEN](state: State, token: Token) {
    state.token = token;
  },
  [MentorMutationTypes.SET_MENTOR](state: State, user: UserDocuments | null) {
    state.mentor = user;
  },
  [MentorMutationTypes.SET_CURRENT_STUDENT_CHAT](
    state: State,
    user: UserDocuments | null
  ) {
    state.currentStudentInfoForChat = user;
  }
};
