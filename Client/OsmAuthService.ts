export default class OsmAuthService {
  get authCookingKey(): string { return "auth_token"; }

  isLoggedIn(): boolean {
    const cookies = document.cookie.split(';');
    const regex = new RegExp(`^${this.authCookingKey}=`)
    for (const cookie of cookies) {
      if (cookie.match(regex))
        return true;
    }
    return false;
  }
}

const osmAuthService = new OsmAuthService();
export { osmAuthService };
