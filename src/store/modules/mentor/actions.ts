import { ActionTree, ActionContext } from 'vuex';
import { RootState } from '@/store';
import { State } from './state';
import { Mutations } from './mutations';
import { MentorActionTypes } from './action-types';
import { MentorMutationTypes } from './mutation-types';
import { MentorAuthServiceApi } from '@/api/services/mentor/mentor-auth-service';

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<State, RootState>, 'commit'>;

export interface Actions {
  [MentorActionTypes.AUTH_REQUEST_MENTOR](
    { commit }: AugmentedActionContext,
    payload: any // Obsolete in here but left as an example
  ): Promise<boolean>;
  [MentorActionTypes.LOG_OUT_MENTOR]({
    commit
  }: AugmentedActionContext): Promise<boolean>;
  [MentorActionTypes.CURRENT_MENTOR]({
    commit
  }: AugmentedActionContext): Promise<boolean>;
}

export const actions: ActionTree<State, RootState> & Actions = {
  async [MentorActionTypes.AUTH_REQUEST_MENTOR]({ commit }, payload: any) {
    const result = await MentorAuthServiceApi.login(payload);
    if (result.data && result.data.token) {
      commit(MentorMutationTypes.SET_TOKEN, result.data.token);
      return true;
    } else {
      commit(MentorMutationTypes.SET_TOKEN, null);
      return false;
    }
  },
  async [MentorActionTypes.LOG_OUT_MENTOR]({ commit }) {
    // const result = await AuthServiceApi.logout();
    commit(MentorMutationTypes.SET_TOKEN, null);
    commit(MentorMutationTypes.SET_MENTOR, null);
    return true;
  },
  async [MentorActionTypes.CURRENT_MENTOR]({ commit }) {
    const result = await MentorAuthServiceApi.currentMentor();
    if (result.data) {
      const temp = result.data;
      commit(MentorMutationTypes.SET_MENTOR, temp);
      return true;
    } else return false;
  }
};
