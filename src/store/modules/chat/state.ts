import { Token, UserDocuments, UserProfileName } from '@/@types';

export type State = {
  user: UserDocuments | null;
  messages: any[] | null;
};

export const state: State = {
  user: null,
  messages: []
};
