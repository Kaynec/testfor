import { instance } from '../../apiclient';
class HamnavardService {
  async get(id: string) {
    return instance.get(`hamnavard/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async getAll(filter) {
    return instance.get(`hamnavard`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      },
      params: {
        filter
      }
    });
  }

  async create(hamnavard: any) {
    return instance.post(`hamnavard`, hamnavard, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async update(id: string, hamnavard: any) {
    return instance.put(`hamnavard/${id}`, hamnavard, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async delete(id: string) {
    return instance.delete(`hamnavard/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
}

export const HamnavardServiceApi = new HamnavardService();
