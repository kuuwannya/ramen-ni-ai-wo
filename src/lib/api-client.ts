import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

const convertImageUrl = (imageUrl: string | null): string | null => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("http")) return imageUrl;
  return `${BASE_URL}${imageUrl}`;
};

type MenuType = {
  id: number;
  name: string;
  genre_name: string;
  noodle_name: string;
  soup_name: string;
  image_url: string;
};

export const secureApiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// リクエストインターセプターでトークンを付与
secureApiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプターでエラーハンドリング
secureApiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userImage");
      }
    }
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export const apiService = {
  getRandomMenus: async () => {
    try {
      const response = await secureApiClient.get("/random_menus");
      if (response.data.menus) {
        response.data.menus = response.data.menus.map((menu: MenuType) => ({
          ...menu,
          image_url: convertImageUrl(menu.image_url),
        }));
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching menus:", error);
      return { menus: [] };
    }
  },

  getMenuDetail: async (id: string | string[]) => {
    const response = await secureApiClient.get(`/menu_with_shops/${id}`);
    if (response.data.image_url) {
      response.data.image_url = convertImageUrl(response.data.image_url);
    }
    return response.data;
  },

  sendRecommendedMenus: async (selectMenuIds: number[], notSelectedMenuIds: number[] = []) => {
    const response = await secureApiClient.post("/recommended_menus", {
      select_menu_ids: selectMenuIds,
      not_selected_menu_ids: notSelectedMenuIds,
    });
    if (response.data.recommended_menu?.image_url) {
      response.data.recommended_menu.image_url = convertImageUrl(response.data.recommended_menu.image_url);
    }
    return response.data;
  },

  googleAuth: async (code: string) => {
    const params = new URLSearchParams();
    params.append("code", code);
    params.append("redirect_uri", `${window.location.origin}/auth/callback`);

    const response = await secureApiClient.post("/auth/google", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  },

  getCurrentUser: async () => {
    try {
      const response = await secureApiClient.get("/me");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getShops: async (page: number = 1) => {
    try {
      const response = await secureApiClient.get("/shops", { params: { page } });
      const headers = response.headers;
      return {
        shops: response.data.shops,
        pagination: {
          current_page: parseInt(headers["current-page"] ?? "1", 10),
          per_page: parseInt(headers["page-items"] ?? "20", 10),
          total_pages: parseInt(headers["total-pages"] ?? "1", 10),
          total_count: parseInt(headers["total-count"] ?? "0", 10),
        },
      };
    } catch (error) {
      console.error("Error fetching shops:", error);
      return { shops: [], pagination: null };
    }
  },
};
