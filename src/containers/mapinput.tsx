import { Button, NumberInput } from "@mantine/core";
import { ReactElement, useEffect, useState } from "react";
import {
  GiPerspectiveDiceSixFacesRandom,
  GiPositionMarker,
} from "react-icons/gi";
import { MdWrongLocation } from "react-icons/md";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

// deck-gl has a lame support for TS, some parts needs to be ts-ignored
//@ts-ignore
import DeckGL, { GeoJsonLayer, IconLayer } from "deck.gl";
import uuid4 from "uuid4";

import api from "../api";
import { SPlaces, SWeatherSetter, SWeatherStatusSetter } from "../states";
import { ICoordinates, loadingState } from "../types";
import { createNewPlace, hexToRGB } from "../utils";
import { colors } from "../variables";

// path to the ne dataset of countries
const COUNTRIES_DATA =
  "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_scale_rank.geojson"; //eslint-disable-line

// initial state of the deck-gl instance
const INITIAL_VIEW_STATE = {
  latitude: 20,
  longitude: 0,
  zoom: 0.5,
  bearing: 0,
  pitch: 0,
};

interface IMapInput {}

/**
 * A component showing inputs for coordinates, action buttons and an interactive map
 */
const MapInput = ({}: IMapInput): ReactElement => {
  const [places, setPlaces] = useRecoilState(SPlaces);

  const [newCoordinates, setNewCoordinates] = useState<ICoordinates>({
    lat: 0,
    lng: 0,
  });

  // add a new place with given coordinates
  const handleAddNewLocation = () => {
    const newPlaceId: string = uuid4();

    const newPlace = createNewPlace(newCoordinates, newPlaceId);
    setPlaces([...places, newPlace]);
  };

  // add a new place with random (but valid) coordinates
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

  // add a new place with (pseudo)random invalid coordinates
  const handleAddNewInvalid = () => {
    const newPlaceId: string = uuid4();
    const invalidLat = [101, -122, 155, -96, 204, -229][
      Math.round(Math.random() * 5)
    ];
    const invalidLng = [259, -378, 697, 191, -542, 181][
      Math.round(Math.random() * 5)
    ];

    const newPlace = createNewPlace(
      { lat: invalidLat, lng: invalidLng },
      newPlaceId
    );
    setPlaces([...places, newPlace]);
  };

  return (
    <div id="mapinput">
      {/* map */}
      <div className="container container-map">
        <DeckGL
          controller={true}
          initialViewState={INITIAL_VIEW_STATE}
          onClick={(info: any, event: any) => {
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
            getLineColor={hexToRGB(colors.white)}
            getFillColor={hexToRGB(colors.secondary)}
          />
          {/* @ts-ignore */}
          <IconLayer
            id={"places-layer"}
            data={places.map((p) => ({
              coordinates: [p.lng, p.lat],
            }))}
            pickable={true}
            iconAtlas="https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png"
            getIcon={(d: any) => "marker"}
            iconMapping={{
              marker: { x: 0, y: 0, width: 128, height: 128, mask: true },
            }}
            sizeScale={5}
            getPosition={(d: any) => d.coordinates}
            getSize={(d: any) => 5}
            getColor={hexToRGB(colors.text)}
          />
          {/* @ts-ignore */}
          <IconLayer
            id={"input-layer"}
            data={[{ coordinates: [newCoordinates.lng, newCoordinates.lat] }]}
            pickable={true}
            iconAtlas="https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png"
            getIcon={(d: any) => "marker"}
            iconMapping={{
              marker: { x: 0, y: 0, width: 128, height: 128, mask: true },
            }}
            sizeScale={5}
            getPosition={(d: any) => d.coordinates}
            getSize={(d: any) => 5}
            getColor={hexToRGB(colors.primary)}
          />
        </DeckGL>
      </div>

      <div className="container container-form">
        {/* inputs */}
        <div className="form-inputs">
          <NumberInput
            label="lattitude"
            className="form-input"
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
            className="form-input"
            value={newCoordinates.lng}
            precision={2}
            min={-180}
            max={180}
            step={0.01}
            onChange={(newValue: number) => {
              setNewCoordinates({ ...newCoordinates, lng: newValue });
            }}
          />
        </div>

        {/* actions */}
        <div className="form-buttons">
          <Button
            className="form-button"
            onClick={() => handleAddNewLocation()}
            style={{
              backgroundColor: colors.primary,
              color: colors.white,
            }}
          >
            <GiPositionMarker size={20} />
            Add place with input coordinates
          </Button>
          <Button
            style={{
              backgroundColor: colors.primary,
              color: colors.white,
            }}
            className="form-button"
            onClick={() => handleAddNewRandom()}
          >
            <GiPerspectiveDiceSixFacesRandom size={20} />
            Add place with random coordinates
          </Button>
          <Button
            style={{
              backgroundColor: colors.primary,
              color: colors.white,
            }}
            className="form-button"
            onClick={() => handleAddNewInvalid()}
          >
            <MdWrongLocation size={20} />
            Add place with invalid coordinates
          </Button>
          {places.map((place) => {
            return <WeatherGetter key={place.id} placeId={place.id} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default MapInput;

/**
 * this is an auxiliary component not returning any DOM. The only function is to handle the api call for a specific place
 */
const WeatherGetter = ({ placeId }: { placeId: string }): ReactElement => {
  const weatherSetter = useSetRecoilState(SWeatherSetter(placeId));
  const weatherStatusSetter = useSetRecoilState(SWeatherStatusSetter(placeId));

  const places = useRecoilValue(SPlaces);

  useEffect(() => {
    weatherStatusSetter(loadingState.LOADING);
    const place = places.find((p) => p.id === placeId);

    // putting an extra loading time to demonstrate the asynchronicity
    const extraLoadingTime = Math.random() * 5000;

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
          }, extraLoadingTime);
        }
      );
    }
  });

  return <></>;
};
