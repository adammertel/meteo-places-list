import { atom, selector, selectorFamily } from "recoil";
import { IPlace, IPlaceWeather, IWeatherData } from "./types";

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

// selector for getting merged data of places and their weather
export const PlacesWeather = selector({
  key: "splaceweather",
  get: ({ get }): IPlaceWeather[] => {
    const places = get(SPlaces);
    const weather = get(SWeather);

    return places.map((place) => {
      if (weather[place.id]) {
        return {
          ...place,
          weather: weather[place.id],
        };
      } else {
        return {
          ...place,
          weather: false,
        };
      }
    });
  },
});
