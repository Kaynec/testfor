import { MutationTree } from 'vuex';

import { Token, UserDocuments } from '@/@types';
import { CurrentQuestionsListInterface } from './state';
import { State } from './state';
import { StudentMutationTypes } from './mutation-types';

export type Mutations<S = State> = {
  [StudentMutationTypes.SET_TOKEN](state: S, payload: Token | null): void;
  [StudentMutationTypes.SET_USER](
    state: S,
    payload: UserDocuments | null
  ): void;
  [StudentMutationTypes.SET_BASKET_COUNT](
    state: S,
    payload: number | null
  ): void;
  [StudentMutationTypes.SET_CURRENT_SHOP_INFO](
    state: S,
    payload: any | null
  ): void;
  [StudentMutationTypes.SET_CURRENT_SUPPORT_PERSON](
    state: S,
    payload: string | null
  ): void;
  [StudentMutationTypes.SET_CURRENT_QUESTIONS](
    state: S,
    payload: CurrentQuestionsListInterface | null
  ): void;
  [StudentMutationTypes.SET_CURRENT_QUESTION](state: S, payload: any);
  [StudentMutationTypes.SET_CURRENT_SELFTEST_REPORT](state: S, payload: any);
  [StudentMutationTypes.SET_ONE_QUESTION_FOR_SELFTEST](state: S, payload: any);
  [StudentMutationTypes.SET_CURRENT_DUEL](state: S, payload: any);
};

export const mutations: MutationTree<State> & Mutations = {
  [StudentMutationTypes.SET_TOKEN](state: State, token: Token) {
    state.token = token;
  },
  [StudentMutationTypes.SET_USER](state: State, user: UserDocuments | null) {
    state.user = user;
  },
  [StudentMutationTypes.SET_BASKET_COUNT](state: State, payload: number) {
    if (payload >= 0) state.BasketCount = payload;
  },
  [StudentMutationTypes.SET_CURRENT_SHOP_INFO](state: State, payload: any) {
    state.CurrentShopInfo = payload;
  },
  [StudentMutationTypes.SET_CURRENT_SUPPORT_PERSON](
    state: State,
    payload: string
  ) {
    state.CurrentSuppertPerson = payload;
  },
  [StudentMutationTypes.SET_CURRENT_QUESTIONS](
    state: State,
    payload: CurrentQuestionsListInterface
  ) {
    state.CurrentQuestionsList = payload;
  },
  [StudentMutationTypes.SET_CURRENT_QUESTION](state: State, payload: any) {
    state.currentQuestion = payload;
  },
  [StudentMutationTypes.SET_CURRENT_SELFTEST_REPORT](
    state: State,
    payload: any
  ) {
    state.currentSelfTestReport = payload;
  },
  [StudentMutationTypes.SET_ONE_QUESTION_FOR_SELFTEST](
    state: State,
    payload: any
  ) {
    state.OneQuestionForSelfTestReport = payload;
  },
  [StudentMutationTypes.SET_CURRENT_DUEL](state: State, payload: any) {
    state.currentDuel = payload;
  }
};
