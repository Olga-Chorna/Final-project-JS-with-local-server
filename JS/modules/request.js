export class RequestManager {
  async reseiveResponse(url) {
    const response = await fetch(url);
    return await response.json();
  }
}
