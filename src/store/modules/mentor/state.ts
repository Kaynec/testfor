import { Token, UserDocuments } from '@/@types';

export type State = {
  token: Token | null;
  mentor: UserDocuments | null;
  currentStudentInfoForChat: UserDocuments | null;
};

export const state: State = {
  token: null,
  mentor: null,
  currentStudentInfoForChat: null
};
