import { studentInstance as instance } from './student-api-client';
class Event {
  async delete(id: string) {
    return instance.delete(`event/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }

  async edit(id: string, newEvent) {
    return instance.put(`event/${id}`, newEvent, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }

  async getAll() {
    return instance.get('event/GetForMonth', {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }

  async get(date) {
    return instance.post(`event/getForMonth`, date, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }

  async create(event) {
    return instance.post(`event`, event, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
}

export const StudentEventApi = new Event();
