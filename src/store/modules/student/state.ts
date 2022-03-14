import { Token, UserDocuments, UserProfileName } from '@/@types';

export interface CurrentQuestionsListInterface {
  title: string;
  currentChunk: number | string;
  questions: any[];
}

export type State = {
  token: Token | null;
  user: UserDocuments | null;
  userProfileName: UserProfileName | null;
  CurrentShopInfo: any | null;
  BasketCount: number;
  CurrentSuppertPerson: string | null;
  CurrentQuestionsList: CurrentQuestionsListInterface | null;
  currentQuestion: Record<string, unknown> | null;
  currentSelfTestReport: Record<string, unknown> | null;
  OneQuestionForSelfTestReport: Record<string, unknown> | null;
  currentDuel: Record<string, unknown> | null;
};

export const state: State = {
  token: null,
  user: null,
  userProfileName: null,
  CurrentShopInfo: null,
  CurrentSuppertPerson: null,
  BasketCount: 0,
  CurrentQuestionsList: {
    title: '',
    currentChunk: 0,
    questions: []
  },
  currentQuestion: null,
  currentSelfTestReport: null,
  OneQuestionForSelfTestReport: null,
  currentDuel: null
};
