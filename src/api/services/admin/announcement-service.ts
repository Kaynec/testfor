// import { instance } from '../../apiclient';
import { instance } from '../../apiclient';

// import { UserDocuments } from '@/@types';
class AnnouncementService {
  async get(id: string) {
    return instance.get(`announcement/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async getAll() {
    return instance.get(`announcement`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async create(notification: any) {
    return instance.post(`announcement`, notification, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async update(id: number, notification: any) {
    return instance.put(`announcement/${id}`, notification, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async delete(id: string) {
    return instance.delete(`announcement/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
}

export const AnnouncementServiceApi = new AnnouncementService();
