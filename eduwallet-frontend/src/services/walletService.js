const API_URL = process.env.REACT_APP_API_URL;

export const getWallet = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_URL}/wallet`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};