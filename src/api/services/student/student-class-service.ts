import { studentInstance as instance } from './student-api-client';
class Class {
  async getAll() {
    return instance.get(`class`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async offlineClass(Class) {
    return instance.post('class/recorded-class-link', Class, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }

  async onlineClass(Class) {
    return instance.post('class/online-meeting', Class, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }

  async recordedClassHistory(Class) {
    return instance.post('class/recorded-classes', Class, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
}

export const StudentClassApi = new Class();
