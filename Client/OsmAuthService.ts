export default class OsmAuthService {
  get authCookieKey(): string { return "auth_token"; }

  isLoggedIn(): boolean {
    const cookies = document.cookie.split(';');
    const regex = new RegExp(`^${this.authCookieKey}=`)
    for (const cookie of cookies) {
      if (cookie.match(regex))
        return true;
    }
    return false;
  }
}

const osmAuthService = new OsmAuthService();
export { osmAuthService };
