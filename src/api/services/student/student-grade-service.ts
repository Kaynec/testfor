import { studentInstance as instance } from './student-api-client';
class Grade {
  async get(id: string) {
    return instance.get(`grade/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async getAll() {
    return instance.get(`grade`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
}

export const StudentGradeApi = new Grade();
