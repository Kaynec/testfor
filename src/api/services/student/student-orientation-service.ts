import { studentInstance as instance } from './student-api-client';
class Orientation {
  async get(id: string) {
    return instance.get(`orientation/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async getAll() {
    return instance.get(`orientation`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
}

export const StudentOrientationApi = new Orientation();
