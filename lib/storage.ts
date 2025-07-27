import Cookies from "js-cookie";

const cookies = Cookies.withAttributes({ path: "/" });

export const cookiesStorage = {
  setItem(key: string, value: any) {
    const itemIsString = typeof value === "string";

    try {
      cookies.set(key, itemIsString ? value : JSON.stringify(value));

      return true;
    } catch (error) {
      console.log(error)
      return false;
    }
  },
  getItem(key: string): string | null {
    try {
      const value = cookies.get(key);

      const itemIsString = typeof value === "string";

      return itemIsString ? value : JSON.parse(value!);
    } catch (error) {
      console.log(error)
      return null;
    }
  },
  clearItem(key: string) {
    try {
      cookies.remove(key);

      return true;
    } catch (error) {
      console.log(error)
      return false;
    }
  },
  clearAll() {
    try {
      const allCookies = cookies.get();

      for (const key in allCookies) {
        if (Object.prototype.hasOwnProperty.call(allCookies, key)) {
          cookies.remove(key);
        }
      }
    } catch (error) {
      console.log(error)
      return false;
    }
  },
};
