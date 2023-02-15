export interface IPlace {
  lat: number;
  lng: number;
  id: string;
}

// this is a interface for combined place and weather objects
export interface IPlaceWeather {
  lat: number;
  lng: number;
  id: string;
  weather: false | IWeatherData;
  status: false | loadingState;
}

export enum loadingState {
  "LOADING" = "loading",
  "READY" = "ready",
  "FAILED" = "failed",
}

export interface ICoordinates {
  lat: number;
  lng: number;
}

export interface IWeatherData {
  temperature: number;
  time: string;
  weathercode: number;
  winddirection: number;
  windspeed: number;
}
