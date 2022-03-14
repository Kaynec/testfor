import { Token, UserDocuments, UserProfileName } from '@/@types';

export type State = {
  token: Token | null;
  user: UserDocuments | null;
  userProfileName: UserProfileName | null;
};

export const state: State = {
  token: null,
  user: null,
  userProfileName: null
};
