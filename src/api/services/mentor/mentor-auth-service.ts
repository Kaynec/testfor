import { MentorInstance as instance } from './mentor-api-client';
import { LoginDocuments } from '@/@types';
class MentorAuthService {
  async login(mentor: LoginDocuments) {
    return instance.post('auth/mentor/login', mentor, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }

  async currentMentor() {
    return instance.get('auth/mentor/me', {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  async uploadProfile(formDataPicture) {
    return instance.post('mentor/uploadProfile', formDataPicture, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  async editMentor(Mentor) {
    return instance.post('auth/mentor/profile', Mentor, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }

  async editCv(cv) {
    return instance.post('auth/mentor/resume', cv, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }

  async requestsList() {
    return instance.get('mentor/getMentorRequests', {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }

  async getMentorStudents() {
    return instance.get('mentor/getMentorStudents', {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }

  async getStudentExams(id: string) {
    return instance.get(`exam/findStudentAllExamForMentor/${id}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }

  async getOneExam(examAndStudentId) {
    return instance.post('take-exam/mentor/result/', examAndStudentId, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }

  async changeRequestStatus(acceptOrReject) {
    return instance.put('mentor/changeRequestStatus', acceptOrReject, {
      headers: {
        contentType: 'application/json'
      }
    });
  }
}

export const MentorAuthServiceApi = new MentorAuthService();
