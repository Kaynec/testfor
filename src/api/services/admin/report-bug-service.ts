import { instance } from '../../apiclient';
import { UserDocuments } from '@/@types';
class ReportBugService {
  async get(id: string) {
    return instance.get(`report-bug/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async getAll(filter: any) {
    return instance.get(`report-bug`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      },
      params: {
        filter
      }
    });
  }
  async create(user: UserDocuments) {
    return instance.post(`report-bug`, user, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async update(id: string, user: Partial<UserDocuments>) {
    return instance.put(`report-bug/${id}`, user, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async delete(id: string) {
    return instance.delete(`report-bug/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
}

export const ReportBugServiceApi = new ReportBugService();
