import { ICoordinates, IPlace } from "./types";

/**
 *
 * @param hex a color hex string
 * @returns a [red, green, blue] array that is supported by deck-gl
 */
export const hexToRGB = (hex: string): [number, number, number] => {
  const m = hex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
  if (m) {
    console.log(m);
    console.log([parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)]);
    return [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)];
  } else {
    return [0, 0, 0];
  }
};

/**
 *
 * @param coordinates
 * @param placeId
 * @returns a new place consisting of given coordinates and id
 */
export const createNewPlace = (
  coordinates: ICoordinates,
  placeId: string
): IPlace => {
  return {
    id: placeId,
    lat: coordinates.lat,
    lng: coordinates.lng,
  };
};
