import axios, { AxiosError, AxiosInstance } from "axios";

class Api {
  private headers: object;
  private connection: AxiosInstance;
  private baseUrl: string;
  constructor() {
    this.headers = {
      "Content-Type": "application/json",
      //"Content-Encoding": "gzip",
    };
    this.baseUrl = "https://api.open-meteo.com/v1/";

    this.connection = axios.create({
      baseURL: this.baseUrl,
      timeout: 8000,
      responseType: "json",
      headers: this.headers,
    });
  }

  static meteoUrl(lat: number, lng: number): string {
    return `forecast?latitude=${lat}&longitude=${lng}&current_weather=true&current_weather=true&timezone=Europe%2FBerlin`;
  }

  getMeteo(latLng: { lat: number; lng: number }, callback: Function) {
    const url = Api.meteoUrl(latLng.lat, latLng.lng);
    try {
      this.connection.get(url).then((res) => {
        callback(res.data.current_weather);
      });
    } catch (err: any | AxiosError) {
      throw { ...err.response.data };
    }
  }
}

export default new Api();
