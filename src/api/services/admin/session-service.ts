import { instance } from '../../apiclient';
import { UserDocuments } from '@/@types';
class SessionService {
  async get(id: string) {
    return instance.get(`session/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async getAll(filter: any) {
    return instance.get(`session`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      },
      params: {
        filter
      }
    });
  }
  async create(user) {
    return instance.post(`session`, user, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async createRange(sessions) {
    return instance.post(`session/range`, sessions, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async update(id: string, user) {
    return instance.put(`session/${id}`, user, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async delete(id: string) {
    return instance.delete(`session/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
}

export const SessionServiceApi = new SessionService();
