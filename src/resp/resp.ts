export const Resp = {
  success: {
    errorCode: 0,
    errorMessage: '',
  },

  // Api Fail
  paramInputEmpty: {
    errorCode: 1000,
    errorMessage: 'param Input Empty',
  },

  // Server Error
  fetchCaddyError: {
    errorCode: 2000,
    errorMessage: 'request caddy失敗',
  },

  // User Fail
  backendCheckSessionFail: {
    errorCode: 3000,
    errorMessage: 'Session無效或過期',
  },

  accountAuthFailure: {
    errorCode: 3001,
    errorMessage: '帳號或密碼錯誤',
  },
};
