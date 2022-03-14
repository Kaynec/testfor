import { studentInstance as instance } from './student-api-client';

class Chat {
  async getStudentAllChatByMentorId(mentorId) {
    return instance.get(`chat/student/${mentorId}`, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
  0;
  async seeMentorMessage(mentor) {
    return instance.put('chat/student/seen', mentor, {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    });
  }
}

export const StudentChatApi = new Chat();
