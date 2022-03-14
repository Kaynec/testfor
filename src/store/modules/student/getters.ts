import { GetterTree } from 'vuex';
import { RootState } from '@/store';
import { State } from './state';
import { UserDocuments } from '@/@types';
import { CurrentQuestionsListInterface } from './state';

export type Getters = {
  getStudentToken(state: State): string | null;
  getCurrentStudent(state: State): UserDocuments | null;
  getBasketCount(state: State): number | null;
  getCurrentShopInfo(state: State): any | null;
  getCurrentSupportPerson: (state) => string | null;
  getCurrentQuestionsList: (state) => CurrentQuestionsListInterface | null;
  getCurrentQuestion: (state) => Record<string, unknown> | null;
  getCurrentDuel: (state) => Record<string, unknown> | null;
  getCurrentSelfTestReport: (state) => Record<string, unknown> | null;
  getOneQuestionForSelfTestReport: (state) => Record<string, unknown> | null;
};

export const getters: GetterTree<State, RootState> & Getters = {
  getStudentToken: (state) => {
    return state.token;
  },
  getCurrentStudent: (state) => {
    return state.user;
  },
  getBasketCount: (state) => {
    return state.BasketCount;
  },
  getCurrentShopInfo: (state) => {
    return state.CurrentShopInfo;
  },
  getCurrentSupportPerson: (state) => {
    return state.CurrentSuppertPerson;
  },
  getCurrentQuestionsList: (state) => {
    return state.CurrentQuestionsList;
  },
  getCurrentQuestion: (state) => {
    return state.currentQuestion;
  },
  getCurrentSelfTestReport: (state) => {
    return state.currentSelfTestReport;
  },
  getOneQuestionForSelfTestReport: (state) => {
    return state.OneQuestionForSelfTestReport;
  },
  getCurrentDuel: (state) => {
    return state.currentDuel;
  }
};
