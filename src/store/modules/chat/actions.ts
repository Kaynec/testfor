import { ActionTree, ActionContext } from 'vuex';
import { RootState } from '@/store';
import { State } from './state';
import { Mutations } from './mutations';
import { ChatActionTypes } from './action-types';
import { ChatMutationTypes } from './mutation-types';
import { StudentAuthServiceApi } from '@/api/services/student/student-auth-service';

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>;

export interface Actions {
  [ChatActionTypes.SOCKET_SEND_MESSAGE](
    { commit }: AugmentedActionContext,
    payload: any // Obsolete in here but left as an example
  ): Promise<boolean>;
  [ChatActionTypes.SOCKET_REGISTER]({
    commit
  }: AugmentedActionContext): Promise<boolean>;
  [ChatActionTypes.SOCKET_CONNECT]({
    commit
  }: AugmentedActionContext): Promise<boolean>;
}

export const actions: ActionTree<State, RootState> & Actions = {
  async [ChatActionTypes.SOCKET_SEND_MESSAGE]({ commit }, payload: any) {
    const result = await StudentAuthServiceApi.login(payload);
    if (result.data && result.data.token) {
      commit(ChatMutationTypes.SOCKET_GET_Message, result.data.token);
      return true;
    } else {
      commit(ChatMutationTypes.SOCKET_GET_Message, null);
      return false;
    }
  },
  async [ChatActionTypes.SOCKET_REGISTER]({ commit }) {
    // const result = await AuthServiceApi.logout();
    commit(ChatMutationTypes.SOCKET_GET_Message, null);
    commit(ChatMutationTypes.SOCKET_GET_Message, null);
    return true;
  },
  async [ChatActionTypes.SOCKET_CONNECT]({ commit }) {
    const result = await StudentAuthServiceApi.currentUser();
    if (result.data) {
      const temp = result.data;
      commit(ChatMutationTypes.SOCKET_GET_Message, temp);
      return true;
    } else return false;
  }
};
