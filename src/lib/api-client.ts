const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const PROXY_URL = "/api/proxy";

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

const parsePagination = (headers: Headers) => ({
  current_page: parseInt(headers.get("current-page") ?? "1", 10),
  per_page: parseInt(headers.get("page-items") ?? "20", 10),
  total_pages: parseInt(headers.get("total-pages") ?? "1", 10),
  total_count: parseInt(headers.get("total-count") ?? "0", 10),
});

async function proxyFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const res = await fetch(`${PROXY_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    },
  });

  if (res.status === 401) {
    fetch("/api/auth/session", { method: "DELETE" });
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    throw new Error(`HTTP error: ${res.status}`);
  }

  return res;
}

export const apiService = {
  getRandomMenus: async () => {
    try {
      const res = await proxyFetch("/random_menus");
      const data = await res.json();
      if (data.menus) {
        data.menus = data.menus.map((menu: MenuType) => ({
          ...menu,
          image_url: convertImageUrl(menu.image_url),
        }));
      }
      return data;
    } catch (error) {
      console.error("Error fetching menus:", error);
      return { menus: [] };
    }
  },

  getMenuDetail: async (id: string | string[]) => {
    const res = await proxyFetch(`/menu_with_shops/${id}`);
    const data = await res.json();
    if (data.image_url) {
      data.image_url = convertImageUrl(data.image_url);
    }
    return data;
  },

  sendRecommendedMenus: async (selectMenuIds: number[], notSelectedMenuIds: number[] = []) => {
    const res = await proxyFetch("/recommended_menus", {
      method: "POST",
      body: JSON.stringify({
        select_menu_ids: selectMenuIds,
        not_selected_menu_ids: notSelectedMenuIds,
      }),
    });
    const data = await res.json();
    if (data.recommended_menu?.image_url) {
      data.recommended_menu.image_url = convertImageUrl(data.recommended_menu.image_url);
    }
    return data;
  },

  getCurrentUser: async () => {
    const res = await proxyFetch("/current_user");
    return res.json();
  },

  getShops: async (page: number = 1) => {
    try {
      const res = await proxyFetch(`/shops?page=${page}`);
      const data = await res.json();
      return {
        shops: data.shops,
        pagination: parsePagination(res.headers),
      };
    } catch (error) {
      console.error("Error fetching shops:", error);
      return { shops: [], pagination: null };
    }
  },

  getShopDetail: async (id: string) => {
    const res = await proxyFetch(`/shops/${id}`);
    return res.json();
  },

  getShopMenus: async (id: string, page: number = 1) => {
    const res = await proxyFetch(`/shops/${id}/menus?page=${page}`);
    const data = await res.json();
    const menus = (data.menus ?? []).map((menu: MenuType & { image_url: string }) => ({
      ...menu,
      image_url: convertImageUrl(menu.image_url),
    }));
    return {
      menus,
      pagination: parsePagination(res.headers),
    };
  },
};
