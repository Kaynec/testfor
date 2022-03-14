import { studentInstance as instance } from './student-api-client';
class Duel {
  async get(id: string) {
    return instance.get(`duel/getOne/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async getAll() {
    return instance.get('duel/GetAll', {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async getResult(id: string) {
    return instance.get(`student-duel/result/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }

  async registerDuel(duel) {
    return instance.post('student-duel', duel, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }

  async getOneQuestion(id: string) {
    return instance.get(`question/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }

  async getRanking(id) {
    return instance.get(`duel/get-ranking/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
}

export const StudentDuelApi = new Duel();
