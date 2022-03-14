import { createStore, createLogger } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import {
  store as users,
  DocumentsStore,
  State as UserState
} from '@/store/modules/admin';
import {
  store as students,
  StudentsStore,
  State as StudentState
} from '@/store/modules/student';
import {
  store as mentors,
  MentorsStore,
  State as MentorState
} from '@/store/modules/mentor';

import {
  store as chats,
  ChatsStore,
  State as ChatState
} from '@/store/modules/chat';

export type RootState = {
  users: UserState;
  students: StudentState;
  chats: ChatState;
  mentors: MentorState;
};

export type AdminStore = DocumentsStore<Pick<RootState, 'users'>>;
export type StudentStore = StudentsStore<Pick<RootState, 'students'>>;
export type ChatStore = ChatsStore<Pick<RootState, 'chats'>>;
export type MentorStore = MentorsStore<Pick<RootState, 'mentors'>>;

// Plug in logger when in development environment
const debug = process.env.NODE_ENV !== 'production';
const plugins = debug ? [createLogger({})] : [];

// Plug in session storage based persistence
plugins.push(createPersistedState({ storage: window.sessionStorage }));

export const store = createStore({
  plugins,
  modules: {
    users,
    students,
    chats,
    mentors
  }
});

export function useAdminStore(): AdminStore {
  return store as AdminStore;
}

export function useStudentStore(): StudentStore {
  return store as StudentStore;
}

export function useChatStore(): ChatStore {
  return store as ChatStore;
}

export function useMentorStore(): MentorStore {
  return store as MentorStore;
}
