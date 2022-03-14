import { instance } from '../../apiclient';

class DuelService {
  async get(id: string) {
    return instance.get(`duel/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async getAll() {
    return instance.get(`duel`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async create(duel: any) {
    return instance.post(`duel`, duel, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async update(id: number, duel: any) {
    return instance.put(`duel/${id}`, duel, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async delete(id: string) {
    return instance.delete(`duel/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async calculate(duel: any) {
    return instance.post(
      `duel/calculate-result`,
      {
        duel: duel
      },
      {
        headers: {
          // Overwrite Axios's automatically set Content-Type
          'Content-Type': 'application/json'
        }
      }
    );
  }
}

export const DuelServiceApi = new DuelService();
