import { ActionTree, ActionContext } from 'vuex';
import { RootState } from '@/store';
import { State } from './state';
import { Mutations } from './mutations';
import { AdminActionTypes } from './action-types';
import { DocumentsMutationTypes } from './mutation-types';
import { AuthServiceApi } from '@/api/services/auth/auth-service';

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>;

export interface Actions {
  [AdminActionTypes.AUTH_REQUEST_ADMIN](
    { commit }: AugmentedActionContext,
    payload: any // Obsolete in here but left as an example
  ): Promise<boolean>;
  [AdminActionTypes.LOG_OUT]({
    commit
  }: AugmentedActionContext): Promise<boolean>;
  [AdminActionTypes.CURRENT_USER]({
    commit
  }: AugmentedActionContext): Promise<boolean>;
}

export const actions: ActionTree<State, RootState> & Actions = {
  async [AdminActionTypes.AUTH_REQUEST_ADMIN]({ commit }, payload: any) {
    const result = await AuthServiceApi.login(payload);
    if (result.data && result.data.token) {
      commit(DocumentsMutationTypes.SET_TOKEN, result.data.token);
      commit(DocumentsMutationTypes.SET_ProfileName, 'admin');
      return true;
    } else {
      commit(DocumentsMutationTypes.SET_TOKEN, null);
      commit(DocumentsMutationTypes.SET_ProfileName, null);
      return false;
    }
  },
  async [AdminActionTypes.LOG_OUT]({ commit }) {
    // const result = await AuthServiceApi.logout();
    commit(DocumentsMutationTypes.SET_TOKEN, null);
    return true;
  },
  async [AdminActionTypes.CURRENT_USER]({ commit }) {
    const result = await AuthServiceApi.currentUser();
    if (result.data) {
      commit(DocumentsMutationTypes.SET_USER, result.data);
      return true;
    } else {
      return false;
    }
  }
};
