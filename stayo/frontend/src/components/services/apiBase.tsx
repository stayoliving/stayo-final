export const BASE_URL = "http://127.0.0.1:8000";

export const apiRequest = (
  endpoint: string,
  method: string = "GET",
  data: any = null,
): Promise<any> => {
  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data && method !== "GET") {
    config.body = JSON.stringify(data);
  }

  return fetch(`${BASE_URL}${endpoint}`, config).then((response) => {
    if (!response.ok) {
      return response.json().then((err) => {
        throw new Error(err.message || `HTTP error ${response.status}`);
      });
    }
    return response.json();
  });
};
