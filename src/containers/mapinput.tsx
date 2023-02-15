import { Button, NumberInput } from "@mantine/core";
import { ReactElement, useEffect, useState } from "react";

import { useRecoilState, useRecoilValue } from "recoil";
import DeckGL, { GeoJsonLayer, IconLayer } from "deck.gl";
import uuid4 from "uuid4";

import api from "../api";
import { SPlaces, SWeatherSetter, SWeatherStatusSetter } from "../states";
import { ICoordinates, IPlace, loadingState } from "../types";

const COUNTRIES_DATA =
  "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_scale_rank.geojson"; //eslint-disable-line

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

  const INITIAL_VIEW_STATE = {
    latitude: 0,
    longitude: 0,
    zoom: 1,
    bearing: 0,
    pitch: 0,
  };

  return (
    <div id="mapinput">
      <DeckGL
        controller={true}
        initialViewState={INITIAL_VIEW_STATE}
        onClick={(info, event) => {
          if (info.coordinate) {
            setNewCoordinates({
              lat: info.coordinate[1],
              lng: info.coordinate[0],
            });
          }
        }}
      >
        {/* @ts-ignore */}
        <GeoJsonLayer
          id="base-map"
          data={COUNTRIES_DATA}
          stroked={true}
          filled={true}
          lineWidthMinPixels={1}
          opacity={0.4}
          getLineColor={[255, 255, 255]}
          getFillColor={[200, 200, 200]}
        />
        {/* @ts-ignore */}
        <IconLayer
          id={"places-layer"}
          data={places.map((p) => ({
            coordinates: [p.lng, p.lat],
          }))}
          pickable={true}
          getIcon={(d: any) => {
            return {
              url: "http://cdn.onlinewebfonts.com/svg/img_196455.png",
              width: 840,
              height: 1239,
              anchorY: 1239,
            };
          }}
          sizeScale={2}
          getPosition={(d: any) => d.coordinates}
          getSize={(d: any) => 25}
          getColor={(d: any) => [120, 140, 0]}
        />
        {/* @ts-ignore */}
        <IconLayer
          id={"input-layer"}
          data={[{ coordinates: [newCoordinates.lng, newCoordinates.lat] }]}
          pickable={true}
          getIcon={(d: any) => {
            return {
              url: "https://cdn1.iconfinder.com/data/icons/color-bold-style/21/14_2-512.png",
              width: 512,
              height: 512,
              anchorY: 512,
            };
          }}
          sizeScale={2}
          getPosition={(d: any) => d.coordinates}
          getSize={(d: any) => 25}
          getColor={(d: any) => [120, 140, 0]}
        />
      </DeckGL>
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
  const [weather, weatherSetter] = useRecoilState(SWeatherSetter(placeId));
  const [weatherStatus, weatherStatusSetter] = useRecoilState(
    SWeatherStatusSetter(placeId)
  );
  const places = useRecoilValue(SPlaces);

  useEffect(() => {
    weatherStatusSetter(loadingState.LOADING);
    const place = places.find((p) => p.id === placeId);
    if (place) {
      console.log(`getting weather data for place with id ${placeId}`);
      api.getMeteo(
        { lat: place.lat, lng: place.lng },
        (err, weatherData: any) => {
          setTimeout(() => {
            if (!err && weatherData) {
              weatherSetter(weatherData);
              weatherStatusSetter(loadingState.READY);
            } else {
              weatherStatusSetter(loadingState.FAILED);
            }
          }, 500);
        }
      );
    }
  }, []);

  return <></>;
};
