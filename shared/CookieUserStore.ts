import jwt_decode from "jwt-decode";
import Cookies from "universal-cookie";
import { Config } from "./constants";
import { BaseUser } from "../models/Accounts";
import { MixpanelActions } from "../screens/Shared/MixPanel";

const mixPanelCookieUserStore = (loginUser: BaseUser) => {
  if (loginUser.userId) {
    MixpanelActions.identify(loginUser.userId);
    MixpanelActions.people.set({ userId: loginUser.userId });
    MixpanelActions.registerOnce({ userId: loginUser.userId });
  }
  let foundAtTheRate = false;
  MixpanelActions.register({
    userEmail: loginUser.email
      .split("")
      .map((value, index) => {
        if (value === "@") foundAtTheRate = true;
        return foundAtTheRate || index == 0 || index == 1 ? value : "*";
      })
      .join(""),
  });
};

class CookieUserStore {
  private user: BaseUser | null = null;
  private accessToken: string | null = null;
  private cookies = new Cookies();
  private tokenRefreshRequestInFlight = false;

  setAccessToken(accessToken: string) {
    if (!this.isTokenValid(accessToken)) {
      this.accessToken = "";
      this.cookies.remove(Config.cookieName);
      return;
    }
    const loginUser: BaseUser = this.tokenToUser(jwt_decode(accessToken));
    this.cookies.set(Config.cookieName, accessToken, {
      path: "/",
      domain: Config.cookieDomain,
    });
    this.user = loginUser;
    this.accessToken = accessToken;
    mixPanelCookieUserStore(loginUser);
  }

  getAccessToken(): string {
    this.accessToken = this.cookies.get(Config.cookieName);
    if (!this.isTokenValid(this.accessToken)) {
      this.accessToken = "";
      this.cookies.remove(Config.cookieName);
      // if (runningInClient() && localStorage) localStorage.removeItem("email");
    }
    return this.accessToken || "";
  }

  getUserDetails(): BaseUser | null {
    if (this.user) {
      return this.user;
    }
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      return null;
    }
    const tokenUser = jwt_decode(accessToken);
    return this.tokenToUser(tokenUser);
  }

  getUserId(): string | null {
    const user = this.getUserDetails();
    if (user) {
      return user?.userId ?? "";
    }
    return null;
  }

  clear() {
    this.user = null;
    this.accessToken = null;
    this.cookies.remove(Config.cookieName, {
      path: "/",
      domain: Config.cookieDomain,
    });
  }

  tokenToUser(tokenUser: any): BaseUser {
    // oauth properties first
    return {
      id: tokenUser.sub || tokenUser.uid,
      email: tokenUser.eml,
      userId: tokenUser.sub || tokenUser.uid,
      issuedAt: new Date(tokenUser.iat * 1000),
      timezone: tokenUser.tz,
    };
  }

  isUserDetailsValid(): boolean {
    const userDetails = cookieUserStore.getUserDetails();
    return !!(
      userDetails &&
      userDetails.issuedAt &&
      userDetails.issuedAt.getTime() +
        Config.tokenExpiryTimeInMin * Config.milliSecondsInMin >
        Date.now()
    );
  }

  isTokenAboutToExpire(): boolean {
    const userDetails = this.getUserDetails();
    return !(
      userDetails &&
      userDetails.issuedAt &&
      userDetails.issuedAt.getTime() - Date.now() <
        Config.tokenRenewalTimeInMin * Config.milliSecondsInMin
    );
  }

  redirectToLogin() {
    this.clear();
    // const url = Config.publicRootUrl();
    // debugger;
    window.location.href = Config.getAbsoluteLogoutUrl(
      `?from=${encodeURIComponent(window.location.href)}`
    );
  }

  private isTokenValid(accessToken: string | null) {
    if (!accessToken) {
      return false;
    }
    const decodedToken: { exp: number } = jwt_decode(accessToken);
    if (!decodedToken.exp) {
      return false;
    }
    const tokenExpiryTime = decodedToken.exp * 1000;
    return tokenExpiryTime >= Date.now();
  }
}

export const cookieUserStore = new CookieUserStore();
