import { studentInstance as instance } from './student-api-client';
class Hamnavard {
  async getAll() {
    return instance.get('hamnavard/getHamnavards', {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async video(id) {
    return instance.get(`hamnavard/getVideo/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        // 'Content-Type': 'application/json'
      }
    });
  }
}

export const StudentHamnavardApi = new Hamnavard();
