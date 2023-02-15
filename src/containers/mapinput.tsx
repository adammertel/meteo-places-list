import { Button, NumberInput } from "@mantine/core";
import { ReactElement, useEffect, useState } from "react";

import { useRecoilState, useRecoilValue } from "recoil";
import uuid4 from "uuid4";

import api from "../api";
import { SPlaces, SWeatherSetter } from "../states";
import { ICoordinates, IPlace } from "../types";

const createNewPlace = (coordinates: ICoordinates, placeId: string): IPlace => {
  return {
    id: placeId,
    lat: coordinates.lat,
    lng: coordinates.lng,
  };
};

interface IMapInput {}

/**
 *
 * @param param0
 * @returns
 */
const MapInput = ({}: IMapInput): ReactElement => {
  const [places, setPlaces] = useRecoilState(SPlaces);

  const [newCoordinates, setNewCoordinates] = useState<ICoordinates>({
    lat: 0,
    lng: 0,
  });

  const handleAddNewLocation = () => {
    const newPlaceId: string = uuid4();

    const newPlace = createNewPlace(newCoordinates, newPlaceId);
    setPlaces([...places, newPlace]);
  };

  const handleAddNewRandom = () => {
    const newPlaceId: string = uuid4();
    const randomLat = Math.random() * 180 - 90;
    const randomLng = Math.random() * 360 - 180;

    const newPlace = createNewPlace(
      { lat: randomLat, lng: randomLng },
      newPlaceId
    );
    setPlaces([...places, newPlace]);
  };

  return (
    <div id="mapinput">
      <div className="mapinput-form">
        <NumberInput
          label="longitude"
          value={newCoordinates.lat}
          precision={2}
          min={-90}
          max={90}
          step={0.01}
          onChange={(newValue: number) => {
            setNewCoordinates({ ...newCoordinates, lat: newValue });
          }}
        />
        <NumberInput
          label="longitude"
          value={newCoordinates.lng}
          precision={2}
          min={-180}
          max={180}
          step={0.01}
          onChange={(newValue: number) => {
            setNewCoordinates({ ...newCoordinates, lng: newValue });
          }}
        />
        <Button onClick={() => handleAddNewLocation()}>
          Add place with input coordinates
        </Button>
        <Button onClick={() => handleAddNewRandom()}>
          Add place with random coordinates
        </Button>
        {places.map((place) => {
          return <WeatherGetter key={place.id} placeId={place.id} />;
        })}
      </div>
    </div>
  );
};

export default MapInput;

/**
 *
 * @param param0
 * @returns
 */
const WeatherGetter = ({ placeId }: { placeId: string }): ReactElement => {
  const [_, weatherSetter] = useRecoilState(SWeatherSetter(placeId));
  const places = useRecoilValue(SPlaces);

  useEffect(() => {
    const place = places.find((p) => p.id === placeId);
    if (place) {
      console.log(`getting weather data for place with id ${placeId}`);
      api.getMeteo({ lat: place.lat, lng: place.lng }, (weatherData: any) => {
        setTimeout(() => {
          weatherSetter(weatherData);
        }, 500);
      });
    }
  }, []);

  return <></>;
};
