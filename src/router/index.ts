import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Main from '@/modules/main/main.vue';

const StudentMain = () => import('@/modules/student-main/student-main.vue');

// const Login = () => import('@/modules/login/login.vue');

const Login = () => import('@/modules/login/login.vue');

const Register = () => import('@/modules/register/register.vue');

const Dashboard = () => import('@/pages/dashboard/dashboard.vue');
const Student = () => import('@/pages/admin/student/student.vue');
const StudentEdit = () => import('@/pages/admin/student/student-edit.vue');
const Profile = () => import('@/pages/profile/profile.vue');
const ForgotPassword = () =>
  import('@/modules/forgot-password/forgot-password.vue');
const Mentor = () => import('@/pages/admin/mentor/mentor.vue');
const MentorEdit = () => import('@/pages/admin/mentor/mentor-edit.vue');
const Admin = () => import('@/pages/admin/admin/admin.vue');
const AdminEdit = () => import('@/pages/admin/admin/admin-edit.vue');
const Course = () => import('@/pages/admin/course/course.vue');
const CourseEdit = () => import('@/pages/admin/course/course-edit.vue');
const Session = () => import('@/pages/admin/session/session.vue');
const SessionEdit = () => import('@/pages/admin/session/session-edit.vue');
const Question = () => import('@/pages/admin/question/question.vue');
const QuestionEdit = () => import('@/pages/admin/question/question-edit.vue');

const Store = () => import('@/pages/admin/store/store.vue');
const StoreEdit = () => import('@/pages/admin/store/store-edit.vue');

const Category = () => import('@/pages/admin/category/category.vue');
const CategoryEdit = () => import('@/pages/admin/category/category-edit.vue');

const Announcement = () =>
  import('@/pages/admin/announcement/announcement.vue');
const AnnouncementEdit = () =>
  import('@/pages/admin/announcement/announcement-edit.vue');

const Notification = () =>
  import('@/pages/admin/notification/notification.vue');
const NotificationEdit = () =>
  import('@/pages/admin/notification/notification-edit.vue');

const Exam = () => import('@/pages/admin/exam/exam.vue');
const ExamEdit = () => import('@/pages/admin/exam/exam-edit.vue');

const AdminDuel = () => import('@/pages/admin/duel/duel.vue');
const AdminDuelEdit = () => import('@/pages/admin/duel/duel-edit.vue');

const ReportBug = () => import('@/pages/admin/report-bug/report-bug.vue');
const hamnavardAdmin = () => import('@/pages/admin/hamnavard/hamnavard.vue');
const hamnavardEdit = () =>
  import('@/pages/admin/hamnavard/hamnavard-create.vue');

// student page import

const StudentLogin = () => import('@/pages/student/login/login.vue');
const Home = () => import('@/pages/student/home/home.vue');
const StudentSignup = () => import('@/pages/student/signup/signup.vue');
const StudentPasswordRecover = () =>
  import('@/pages/student/password-recover/password-recover.vue');
const StudentAuthentication = () =>
  import('@/pages/student/authentication/StudentAuthentication.vue');
const StudentSetting = () => import('@/pages/student/setting/setting.vue');

const StudentShop = () => import('@/pages/student/shop/shop.vue');
const ShopBookList = () => import('@/pages/student/shop/shop-book-list.vue');
const SingleBookInfo = () => import('@/pages/student/shop/shop-book-info.vue');
const ShopSuccess = () => import('@/pages/student/shop/shop-order-success.vue');
const ShopFailure = () => import('@/pages/student/shop/shop-order-fail.vue');
const ShopBasket = () => import('@/pages/student/shop/shop-basket.vue');
const ShopAddress = () => import('@/pages/student/shop/shop-address.vue');
const ShopMessage = () => import('@/pages/student/shop/shop-message.vue');

const StudentGroupPage = () => import('@/pages/student/group/group.vue');

const Hamnavard = () => import('@/pages/student/hamnavard/hamnavard.vue');
const Video = () => import('@/pages/student/hamnavard/video.vue');

const SelfTest = () => import('@/pages/student/azmoon/self-test.vue');
const CustomGroupPage = () => import('@/pages/student/group/custom-group.vue');
const SelfTestQuestions = () =>
  import('@/pages/student/azmoon/self-test-questions.vue');
const SelfTestQuestionsChoosen = () =>
  import('@/pages/student/azmoon/self-test-choosen-questions.vue');
const SelfTestQuestionsAnswer = () =>
  import('@/pages/student/azmoon/self-test-answers.vue');
const QuestionsChoosenNumbers = () =>
  import('@/pages/student/azmoon/self-test-choosen-questions-number.vue');
const SelfTestAnswersList = () =>
  import('@/pages/student/azmoon/self-test-answers-list.vue');
const SelfTestReportCard = () =>
  import('@/pages/student/azmoon/self-test-report.vue');
const QuestionsChoosenlist = () =>
  import('@/pages/student/azmoon/choosen-questions-list.vue');
const ChoosenQuestion = () =>
  import('@/pages/student/azmoon/choosen-question.vue');
const SelfTestOneQuestion = () =>
  import('@/pages/student/azmoon/self-test-one-question.vue');

const ReportCard = () => import('@/pages/student/azmoon/report-card.vue');
const CompTest = () => import('@/pages/student/azmoon/comp-test.vue');
const CompTestQuestions = () =>
  import('@/pages/student/azmoon/comp-test-questions.vue');
const CompTestStart = () =>
  import('@/pages/student/azmoon/comp-test-startTest.vue');
const CompTestAnswer = () =>
  import('@/pages/student/azmoon/comp-test-answer.vue');
const CompTestAnswers = () =>
  import('@/pages/student/azmoon/comp-test-answers-list.vue');

const Duel = () => import('@/pages/student/duel/duel.vue');
const DuelStart = () => import('@/pages/student/duel/duel-start.vue');
const DuelReportCard = () =>
  import('@/pages/student/duel/duel-report-card.vue');
const DuelAll = () => import('@/pages/student/duel/duel-all.vue');
const DuelQuestions = () => import('@/pages/student/duel/duel-questions.vue');
const DuelAnswers = () => import('@/pages/student/duel/duel-answers.vue');
const DuelAnswer = () => import('@/pages/student/duel/duel-answer.vue');

const ContactUs = () => import('@/pages/student/contact-us/contact-us.vue');
const ContactBackup = () =>
  import('@/pages/student/contact-backup/contact-backup.vue');
const ContactBackupInfo = () =>
  import('@/pages/student/contact-backup/contact-backup-info.vue');
const ContactBackupChat = () =>
  import('@/pages/student/contact-backup/contact-backup-chat.vue');

const ClassRoom = () => import('@/pages/student/class/class-room.vue');
const selfTestNote = () => import('@/pages/student/azmoon/self-test-note.vue');
const ClassAdobe = () => import('@/pages/student/class/class-adobe.vue');

const MyProfile = () => import('@/pages/student/profile/my-profile.vue');
const ProfilePoints = () => import('@/pages/student/profile/points.vue');
const Inbox = () => import('@/pages/student/profile/inbox.vue');
const PurchaseHistory = () => import('@/pages/student/profile/history.vue');
const EditProfile = () => import('@/pages/student/profile/edit-profile.vue');
const InviteFriends = () => import('@/pages/student/profile/invite.vue');

const News = () => import('@/pages/student/news/news.vue');

const PDF = () => import('@/pages/student/pdf/pdf.vue');

const Calendar = () => import('@/pages/student/calendar/calendar.vue');

const PodCastPlayer = () => import('@/pages/student/podcast/podcast.vue');

const MentorMain = () => import('@/modules/mentor-main/mentor-main.vue');
const MentorLogin = () => import('@/pages/mentor/login.vue');
const MentorProfile = () => import('@/pages/mentor/profile.vue');
const Mentoredit = () => import('@/pages/mentor/edit-profile.vue');
const EditCV = () => import('@/pages/mentor/edit-cv.vue');
const Requests = () => import('@/pages/mentor/requests.vue');
const MentorStudents = () => import('@/pages/mentor/mentor-students.vue');
const Azmoon = () => import('@/pages/mentor/azmoon.vue');
const MentorReportCard = () => import('@/pages/mentor/report-card.vue');
const MentorChat = () => import('@/pages/mentor/chat.vue');

import { useAdminStore, useStudentStore, useMentorStore } from '@/store';
const ifNotAuthenticated = (to: any, from: any, next: any) => {
  if (!useAdminStore().getters.getUserToken) {
    next();
    return;
  }
  next('/admin');
};
const ifAuthenticated = (to: any, from: any, next: any) => {
  if (useAdminStore().getters.getUserToken) {
    next();
    return;
  }
  next('/admin/login');
};
const ifStudentNotAuthenticated = (to: any, from: any, next: any) => {
  if (!useStudentStore().getters.getStudentToken) {
    next();
    return;
  }
  next('/student/home');
};
const ifStudentAuthenticated = (to: any, from: any, next: any) => {
  if (useStudentStore().getters.getStudentToken) {
    next();
    return;
  }
  next('/student/login');
};

const ifMentorNotAuthenticated = (to: any, from: any, next: any) => {
  if (!useMentorStore().getters.getMentorToken) {
    next();
    return;
  }
  next('/mentor/login');
};

const ifMentorAuthenticated = (to: any, from: any, next: any) => {
  if (useMentorStore().getters.getMentorToken) {
    next();
    return;
  }
  next('/mentor/profile');
};

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Main',
    redirect: '/student/home',
    beforeEnter: ifStudentAuthenticated
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Main,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard
      },
      {
        path: 'admin',
        name: 'Admin-List',
        component: Admin
      },
      {
        path: 'admin-create',
        name: 'admin-create',
        component: AdminEdit
      },
      {
        path: 'admin-edit/:adminId',
        name: 'admin-edit',
        component: AdminEdit
      },
      {
        path: 'student',
        name: 'student',
        component: Student
      },
      {
        path: 'student-create',
        name: 'student-create',
        props: true,
        component: StudentEdit
      },
      {
        path: 'student-edit',
        name: 'student-edit',
        props: true,
        component: StudentEdit
      },
      {
        path: 'mentor',
        name: 'mentor',
        component: Mentor
      },
      {
        path: 'mentor-create',
        name: 'mentor-create',
        props: true,
        component: MentorEdit
      },
      {
        path: 'mentor-edit',
        name: 'mentor-edit',
        props: true,
        component: MentorEdit
      },

      {
        path: 'course/:gradeId?/:groupId?/:fieldId?',
        name: 'course',
        props: true,
        component: Course
      },
      {
        path: 'course-create/:gradeId?/:groupId?/:fieldId?',
        name: 'course-create',
        props: true,
        component: CourseEdit
      },
      {
        path: 'course-edit/:courseId/:gradeId?/:groupId?/:fieldId?',
        name: 'course-edit',
        props: true,
        component: CourseEdit
      },
      {
        path: 'session/:gradeId/:groupId/:fieldId/:courseId',
        name: 'session',
        props: true,
        component: Session
      },
      {
        path: 'session-create/:gradeId/:groupId/:fieldId',
        name: 'session-create',
        props: true,
        component: SessionEdit
      },
      {
        path: 'session-edit/:gradeId/:groupId/:fieldId/:courseId/:sessionId',
        name: 'session-edit',
        props: true,
        component: SessionEdit
      },

      {
        path: 'question/:gradeId/:groupId/:fieldId/:courseId/:sessionId',
        name: 'question',
        props: true,
        component: Question
      },
      {
        path: 'question-create/:gradeId/:groupId/:fieldId/:courseId/:sessionId',
        name: 'question-create',
        props: true,
        component: QuestionEdit
      },
      {
        path: 'question-edit/:gradeId/:groupId/:fieldId/:courseId/:sessionId/:question',
        name: 'question-edit',
        props: true,
        component: QuestionEdit
      },

      {
        path: 'store',
        name: 'store',
        component: Store
      },
      {
        path: 'store-create',
        name: 'store-create',
        props: true,
        component: StoreEdit
      },
      {
        path: 'store-edit/:productId',
        name: 'store-edit',
        props: true,
        component: StoreEdit
      },

      {
        path: 'category',
        name: 'category',
        props: true,
        component: Category
      },
      {
        path: 'category-create',
        name: 'category-create',
        props: true,
        component: CategoryEdit
      },
      {
        path: 'category-edit',
        name: 'category-edit',
        props: true,
        component: CategoryEdit
      },

      {
        path: 'announcement',
        name: 'announcement',
        props: true,
        component: Announcement
      },
      {
        path: 'announcement-create',
        name: 'announcement-create',
        props: true,
        component: AnnouncementEdit
      },
      {
        path: 'announcement-edit',
        name: 'announcement-edit',
        props: true,
        component: AnnouncementEdit
      },

      {
        path: 'notification',
        name: 'notification',
        props: true,
        component: Notification
      },
      {
        path: 'notification-create',
        name: 'notification-create',
        props: true,
        component: NotificationEdit
      },
      {
        path: 'notification-edit',
        name: 'notification-edit',
        props: true,
        component: NotificationEdit
      },

      {
        path: 'exam',
        name: 'exam',
        props: true,
        component: Exam
      },
      {
        path: 'exam-create',
        name: 'exam-create',
        props: true,
        component: ExamEdit
      },
      {
        path: 'exam-edit',
        name: 'exam-edit',
        props: true,
        component: ExamEdit
      },

      {
        path: 'duel',
        name: 'duel',
        props: true,
        component: AdminDuel
      },
      {
        path: 'duel-create',
        name: 'duel-create',
        props: true,
        component: AdminDuelEdit
      },
      {
        path: 'duel-edit',
        name: 'duel-edit',
        props: true,
        component: AdminDuelEdit
      },

      {
        path: 'profile',
        name: 'Profile',
        component: Profile
      },
      {
        path: 'report-bug',
        name: 'report-bug',
        component: ReportBug
      },
      {
        path: 'hamnavard',
        name: 'hamnavard',
        component: hamnavardAdmin
      },
      {
        path: 'hamnavard-edit/:hamnavardId',
        name: 'hamnavard-edit',
        component: hamnavardEdit
      },
      {
        path: 'hamnavard-create',
        name: 'hamnavard-create',
        component: hamnavardEdit
      }
    ],
    beforeEnter: ifAuthenticated
  },
  {
    path: '/student',
    name: 'Student',
    component: StudentMain,
    children: [
      {
        path: 'login',
        name: 'StudentLogin',
        component: StudentLogin,
        beforeEnter: ifStudentNotAuthenticated
      },

      {
        path: 'password-recover',
        name: 'StudentPasswordRecover',
        component: StudentPasswordRecover,
        props: true,
        beforeEnter: ifStudentNotAuthenticated
      },
      {
        path: 'Authentication',
        name: 'StudentAuthentication',
        component: StudentAuthentication,
        props: true,
        beforeEnter: ifStudentNotAuthenticated
      },

      {
        path: 'signup/:inviteCode?',
        name: 'StudentSignup',
        component: StudentSignup,
        beforeEnter: ifStudentNotAuthenticated
      },
      {
        path: 'home',
        name: 'Home',
        component: Home,
        beforeEnter: ifStudentAuthenticated
      },
      {
        path: 'setting',
        name: 'StudentSetting',
        component: StudentSetting,
        beforeEnter: ifStudentAuthenticated
      },
      {
        path: 'shop',
        name: 'studentShop',
        component: StudentShop,
        beforeEnter: ifStudentAuthenticated
      },
      {
        path: 'group',
        name: 'StudentGroupPage',
        component: StudentGroupPage,
        beforeEnter: ifStudentAuthenticated
      },
      {
        path: 'self-test',
        name: 'SelfTest',
        component: SelfTest,
        beforeEnter: ifStudentAuthenticated
      },

      {
        path: 'custom-group-page/:id',
        name: 'CustomGroupPage',
        component: CustomGroupPage,
        beforeEnter: ifStudentAuthenticated
      },
      {
        path: 'self-test-note',
        name: 'SelfTestNote',
        component: selfTestNote,
        beforeEnter: ifStudentAuthenticated,
        props: true
      },
      {
        path: 'self-test-questions/:id',
        name: 'SelfTestQuestions',
        component: SelfTestQuestions,
        beforeEnter: ifStudentAuthenticated,
        props: true
      },

      {
        path: 'SelfTestReportCard',
        name: 'SelfTestReportCard',
        props: true,
        component: SelfTestReportCard,
        beforeEnter: ifStudentAuthenticated
      },

      {
        path: 'one-question/:id',
        name: 'SelfTestOneQuestion',
        props: true,
        component: SelfTestOneQuestion,
        beforeEnter: ifStudentAuthenticated
      },

      {
        path: 'self-test-questions-choosen',
        name: 'SelfTestQuestionsChoosen',
        component: SelfTestQuestionsChoosen,
        props: true,
        beforeEnter: ifStudentAuthenticated
      },
      {
        path: 'choosen-number',
        name: 'QuestionsChoosenNumbers',
        component: QuestionsChoosenNumbers,
        beforeEnter: ifStudentAuthenticated
      },
      {
        path: 'choosen-list',
        name: 'QuestionsChoosenList',
        component: QuestionsChoosenlist,
        beforeEnter: ifStudentAuthenticated
      },
      {
        path: 'choosen-question/:id',
        name: 'ChoosenQuestion',
        component: ChoosenQuestion,
        beforeEnter: ifStudentAuthenticated
      },
      {
        path: 'self-test-answer/:idx',
        name: 'SelfTestQuestionsAnswer',
        component: SelfTestQuestionsAnswer,
        props: true,
        beforeEnter: ifStudentAuthenticated
      },

      {
        path: 'self-test-answers-list',
        name: 'SelfTestAnswersList',
        component: SelfTestAnswersList,
        props: true,
        beforeEnter: ifStudentAuthenticated
      },
      {
        path: 'duel',
        name: 'Duel',
        component: Duel,
        beforeEnter: ifStudentAuthenticated
      },

      {
        path: 'duel-start/:id',
        name: 'DuelStart',
        component: DuelStart,
        beforeEnter: ifStudentAuthenticated
      },

      {
        path: 'duel-report-card/:id',
        name: 'DuelReportCard',
        beforeEnter: ifStudentAuthenticated,
        component: DuelReportCard
      },

      {
        path: 'duel-questions/:id',
        name: 'DuelQuestions',
        component: DuelQuestions,
        beforeEnter: ifStudentAuthenticated
      },

      {
        path: 'duel-answers/:id',
        name: 'DuelAnswers',
        component: DuelAnswers,
        beforeEnter: ifStudentAuthenticated
      },

      {
        path: 'duel-answer/:id',
        name: 'DuelAnswer',
        component: DuelAnswer,
        beforeEnter: ifStudentAuthenticated
      },

      {
        path: 'duel-all',
        name: 'DuelAll',
        component: DuelAll,
        beforeEnter: ifStudentAuthenticated
      },
      {
        path: 'report-card/:id',
        name: 'ReportCard',
        component: ReportCard,
        beforeEnter: ifStudentAuthenticated,
        props: true
      },
      {
        path: 'comp-test',
        name: 'compTest',
        component: CompTest,
        beforeEnter: ifStudentAuthenticated
      },
      {
        path: 'comp-test-start/:id',
        name: 'compTestStart',
        props: true,
        component: CompTestStart,
        beforeEnter: ifStudentAuthenticated
      },
      {
        path: 'comp-test-answers/:id',
        name: 'CompTestAnswers',
        props: true,
        component: CompTestAnswers,
        beforeEnter: ifStudentAuthenticated
      },
      {
        path: 'comp-test-answer/:id',
        name: 'CompTestAnswer',
        props: true,
        component: CompTestAnswer,
        beforeEnter: ifStudentAuthenticated
      },
      {
        path: 'comp-test-questions/:id',
        name: 'CompTestQuestions',
        props: true,
        component: CompTestQuestions,
        beforeEnter: ifStudentAuthenticated
      },

      {
        path: 'hamnavard/:percent',
        name: 'Hamnavard',
        component: Hamnavard,
        beforeEnter: ifStudentAuthenticated
      },
      {
        path: 'Video/:filename',
        name: 'Video',
        component: Video,
        beforeEnter: ifStudentAuthenticated
      },
      {
        path: 'contact-us',
        name: 'contactUs',
        component: ContactUs,
        beforeEnter: ifStudentAuthenticated
      },
      {
        path: 'shop-basket',
        name: 'ShopBasket',
        component: ShopBasket,
        beforeEnter: ifStudentAuthenticated
      },
      {
        path: 'shop-book-list/:id',
        name: 'ShopBookList',
        component: ShopBookList,
        props: true,
        beforeEnter: ifStudentAuthenticated
      },
      {
        path: 'shop-single-book',
        name: 'SingleBookInfo',
        component: SingleBookInfo,
        beforeEnter: ifStudentAuthenticated,
        props: true
      },
      {
        path: 'shop-failure',
        name: 'ShopFailure',
        component: ShopFailure,
        beforeEnter: ifStudentAuthenticated,
        props: true
      },
      {
        path: 'shop-success',
        name: 'ShopSuccess',
        component: ShopSuccess,
        props: true,
        beforeEnter: ifStudentAuthenticated
      },
      {
        path: 'shop-address',
        name: 'ShopAddress',
        component: ShopAddress,
        props: true,
        beforeEnter: ifStudentAuthenticated
      },
      {
        path: 'shop-message',
        name: 'ShopMessage',
        component: ShopMessage,
        beforeEnter: ifStudentAuthenticated,
        props: true
      },
      {
        path: 'contact-backup',
        name: 'ContactBackup',
        component: ContactBackup,
        beforeEnter: ifStudentAuthenticated,
        props: true
      },
      {
        path: 'contact-backup-info',
        name: 'ContactBackupInfo',
        component: ContactBackupInfo,
        beforeEnter: ifStudentAuthenticated,
        props: true
      },
      {
        path: 'podcast/:filename',
        name: 'Podcast',
        component: PodCastPlayer,
        beforeEnter: ifStudentAuthenticated,
        props: true
      },
      {
        path: 'contact-backup-chat/:id',
        name: 'ContactBackupChat',
        component: ContactBackupChat,
        beforeEnter: ifStudentAuthenticated,
        props: true
      },
      {
        path: 'class-room',
        name: 'ClassRoom',
        component: ClassRoom,
        beforeEnter: ifStudentAuthenticated,
        props: true
      },
      {
        path: 'class-adobe',
        name: 'ClassAdobe',
        component: ClassAdobe,
        beforeEnter: ifStudentAuthenticated,
        props: true
      },

      {
        path: 'my-profile',
        name: 'MyProfile',
        component: MyProfile,
        beforeEnter: ifStudentAuthenticated,
        props: true
      },

      {
        path: 'book/:filename',
        name: 'PDF',
        component: PDF,
        beforeEnter: ifStudentAuthenticated
      },
      {
        path: 'profile-points',
        name: 'ProfilePoints',
        component: ProfilePoints,
        beforeEnter: ifStudentAuthenticated,
        props: true
      },
      {
        path: 'profile-inbox',
        name: 'Inbox',
        component: Inbox,
        beforeEnter: ifStudentAuthenticated,
        props: true
      },
      {
        path: 'purchase-history',
        name: 'PurchaseHistory',
        component: PurchaseHistory,
        beforeEnter: ifStudentAuthenticated,
        props: true
      },
      {
        path: 'edit-profile',
        name: 'EditProfile',
        component: EditProfile,
        beforeEnter: ifStudentAuthenticated,
        props: true
      },
      {
        path: 'profile-invite',
        name: 'InviteFriends',
        component: InviteFriends,
        beforeEnter: ifStudentAuthenticated,
        props: true
      },
      {
        path: 'calendar',
        name: 'Calendar',
        component: Calendar,
        beforeEnter: ifStudentAuthenticated,
        props: true
      },

      {
        path: 'news',
        name: 'News',
        component: News,
        beforeEnter: ifStudentAuthenticated,
        props: true
      }
    ]
  },
  {
    path: '/mentor',
    name: 'Mentor',
    component: MentorMain,
    children: [
      {
        path: 'login',
        name: 'MentorLogin',
        component: MentorLogin,
        beforeEnter: ifMentorNotAuthenticated
      },
      {
        path: 'profile',
        name: 'MentorProfile',
        component: MentorProfile,
        beforeEnter: ifMentorAuthenticated
      },

      {
        path: 'edit-profile',
        name: 'MentorEdit',
        component: Mentoredit,
        beforeEnter: ifMentorAuthenticated
      },

      {
        path: 'edit-cv',
        name: 'EditCV',
        component: EditCV,
        beforeEnter: ifMentorAuthenticated
      },
      {
        path: 'requests',
        name: 'Requests',
        component: Requests,
        beforeEnter: ifMentorAuthenticated
      },
      {
        path: 'students',
        name: 'MentorStudents',
        component: MentorStudents,
        beforeEnter: ifMentorAuthenticated
      },
      {
        path: 'azmoon/:id',
        name: 'Azmoon',
        component: Azmoon,
        beforeEnter: ifMentorAuthenticated
      },
      {
        path: 'report-card/:id/:studentId',
        name: 'MentorReportCard',
        component: MentorReportCard,
        beforeEnter: ifMentorAuthenticated
      },
      {
        path: 'mentor-chat/:id',
        name: 'MentorChat',
        component: MentorChat,
        beforeEnter: ifMentorAuthenticated
      },
      {
        path: 'contact-us',
        name: 'MentorContactUs',
        component: ContactUs,
        beforeEnter: ifMentorAuthenticated
      }
    ]
  },
  {
    path: '/admin/login',
    name: 'Login',
    component: Login,
    beforeEnter: ifNotAuthenticated
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    beforeEnter: ifNotAuthenticated
  },
  {
    path: '/ ',
    name: 'ForgotPassword',
    component: ForgotPassword,
    beforeEnter: ifNotAuthenticated
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
