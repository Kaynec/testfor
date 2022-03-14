import { MutationTree } from 'vuex';

import { Token, UserDocuments } from '@/@types';

import { State } from './state';
import { ChatMutationTypes } from './mutation-types';

export type Mutations<S = State> = {
  [ChatMutationTypes.SOCKET_GET_Message](
    state: S,
    message: string | null
  ): void;
  [ChatMutationTypes.EMPTY_MESSAGES](state: S): void;
};

export const mutations: MutationTree<State> & Mutations = {
  [ChatMutationTypes.SOCKET_GET_Message](state: State, message: string) {
    state.messages?.push(message);
  },
  [ChatMutationTypes.EMPTY_MESSAGES](state: State) {
    state.messages = [];
  }
};
