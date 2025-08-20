// utils/token.ts
export class TokenUtil {
  static accessToken?: string;
  static refreshToken?: string;

  // Load token dari localStorage
  static loadToken() {
    if (typeof window === "undefined") return;

    const accessToken = localStorage.getItem("access_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (accessToken) TokenUtil.accessToken = accessToken;
    if (refreshToken) TokenUtil.refreshToken = refreshToken;
  }

  // Simpan token ke localStorage
  static persistToken() {
    if (TokenUtil.accessToken) {
      localStorage.setItem("access_token", TokenUtil.accessToken);
    } else {
      localStorage.removeItem("access_token");
    }

    if (TokenUtil.refreshToken) {
      localStorage.setItem("refresh_token", TokenUtil.refreshToken);
    } else {
      localStorage.removeItem("refresh_token");
    }
  }

  static setAccessToken(token: string) {
    TokenUtil.accessToken = token;
    TokenUtil.persistToken();
  }

  static setRefreshToken(token: string) {
    TokenUtil.refreshToken = token;
    TokenUtil.persistToken();
  }

  static clearAccessToken() {
    TokenUtil.accessToken = undefined;
    localStorage.removeItem("access_token");
  }

  static clearRefreshToken() {
    TokenUtil.refreshToken = undefined;
    localStorage.removeItem("refresh_token");
  }
}
