import { MutationTree } from 'vuex';

import { Token, UserDocuments, UserProfileName } from '@/@types';

import { State } from './state';
import { DocumentsMutationTypes } from './mutation-types';

export type Mutations<S = State> = {
  [DocumentsMutationTypes.SET_TOKEN](state: S, payload: Token | null): void;
  [DocumentsMutationTypes.SET_USER](state: S, payload: UserDocuments): void;
  [DocumentsMutationTypes.SET_ProfileName](
    state: S,
    payload: UserProfileName | null
  ): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [DocumentsMutationTypes.SET_TOKEN](state: State, token: Token) {
    state.token = token;
  },
  [DocumentsMutationTypes.SET_USER](state: State, user: UserDocuments) {
    state.user = user;
  },
  [DocumentsMutationTypes.SET_ProfileName](
    state: State,
    userProfileName: UserProfileName
  ) {
    state.userProfileName = userProfileName;
  }
};
