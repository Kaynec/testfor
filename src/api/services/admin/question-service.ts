import { instance } from '../../apiclient';
class QuestionService {
  async get(id: string) {
    return instance.get(`question/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async getAll(filter: any) {
    return instance.get(`question`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      },
      params: {
        filter
      }
    });
  }
  async create(question: any) {
    return instance.post(`question`, question, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async update(id: string, question: any) {
    return instance.put(`question/${id}`, question, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async delete(id: string) {
    return instance.delete(`question/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
}

export const QuestionServiceApi = new QuestionService();
