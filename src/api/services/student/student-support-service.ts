import { studentInstance as instance } from './student-api-client';

class Support {
  async getAll() {
    return instance.get('mentor/getAll', {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }

  async SendSupportRequest(mentorId: any) {
    return instance.post('mentor/request', mentorId, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async getByIdForStudent(mentorId) {
    return instance.get(`mentor/getOneForStudent/${mentorId}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }

  async getpicture(name: string) {
    return instance.get(`api/mentor/getProfileImage/${name}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        // 'Content-Type': 'application/json'
      }
    });
  }
}

export const StudentSupportApi = new Support();
