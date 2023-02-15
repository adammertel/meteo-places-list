import { atom, selector, selectorFamily } from "recoil";
import { IPlace, IPlaceWeather, IWeatherData, loadingState } from "./types";

// places atom
export const SPlaces = atom<IPlace[]>({
  key: "splaces",
  default: [],
});

// weather atom
export const SWeather = atom<{ [key: string]: IWeatherData }>({
  key: "sweather",
  default: {},
});

// weather status atom
export const SWeatherStatus = atom<{ [key: string]: loadingState }>({
  key: "sweatherstatus",
  default: {},
});

// selector for single weather atoms
export const SWeatherSetter = selectorFamily({
  key: "sweathersetter",
  get:
    (placeId: any) =>
    ({ get }: { get: any }): any => {
      return get(SWeather)[placeId];
    },
  set: (placeId: string) => {
    return ({ set }, newValue) => {
      return set(SWeather, (prevState: any) => {
        return {
          ...prevState,
          [placeId]: newValue,
        };
      });
    };
  },
});

// selector for single weather status atoms
export const SWeatherStatusSetter = selectorFamily({
  key: "sweatherstatussetter",
  get:
    (placeId: any) =>
    ({ get }: { get: any }): any => {
      return get(SWeatherStatus)[placeId];
    },
  set: (placeId: string) => {
    return ({ set }, newValue) => {
      return set(SWeatherStatus, (prevState: any) => {
        return {
          ...prevState,
          [placeId]: newValue,
        };
      });
    };
  },
});

// selector for getting merged data of places and their weather
export const PlacesWeather = selector({
  key: "splaceweather",
  get: ({ get }): IPlaceWeather[] => {
    const places = get(SPlaces);
    const weathers = get(SWeather);
    const statuses = get(SWeatherStatus);

    return places.map((place: IPlace) => {
      const placeOut = {
        ...place,

        weather: weathers[place.id] || false,
        status: statuses[place.id] || false,
      };
      return placeOut as IPlaceWeather;
    });
  },
});
