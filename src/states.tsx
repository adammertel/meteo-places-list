import { atom, selector } from "recoil";
import { IPlaces } from "./types";

export const SPlaces = atom<IPlaces[]>({
  key: "places",
  default: [],
});
