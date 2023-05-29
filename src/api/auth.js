import axios from 'axios';
const authUrl = 'https://todo-list.alphacamp.io/api/auth';

export const login = async ({ username, password }) => {
  try {
    const res = await axios.post(`${authUrl}/login`, {
      username,
      password,
    });
    const data = res.data; //透過axios打api, 回傳資料會包在data的物件裡
    const { authToken } = data;
    if (authToken) {
      return { success: true, ...data };
    }
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const register = async ({ username, email, password }) => {
  try {
    const { data } = await axios.post(`${authUrl}/register`, {
      username,
      email,
      password,
    });
    const { authToken } = data;
    if (authToken) {
      return { success: true, ...data };
    }
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const checkPermission = async (authToken) => {
  try {
    const res = await axios.get(`${authUrl}/test-token`, {
      headers: {
        Authorization: 'Bearer ' + authToken,
      },
    });
    return res.data.success;
  } catch (error) {
    console.error(error);
  }
};
