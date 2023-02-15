import { ReactElement } from "react";

import { ActionIcon, Button, Table } from "@mantine/core";

import { useRecoilState, useRecoilValue } from "recoil";
import { IPlaceWeather } from "../types";
import { PlacesWeather, SPlaces } from "./../states";
import { FaTrash } from "react-icons/fa";

interface ILocationTable {}

const LocationTable = ({}: ILocationTable): ReactElement => {
  const placesWeather = useRecoilValue(PlacesWeather);
  const [places, setPlaces] = useRecoilState(SPlaces);

  return (
    <div id="locationtable">
      <Table>
        <thead>
          <tr>
            <th>id</th>
            <th>lat</th>
            <th>lng</th>
            <th>status</th>
            <th>temperature</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {placesWeather.map((place: IPlaceWeather) => {
            return (
              <tr key={place.id}>
                <td>{place.id}</td>
                <td>{place.lat.toFixed(2)}</td>
                <td>{place.lng.toFixed(2)}</td>
                <td>{place.status}</td>
                <td>{place.weather ? place.weather.temperature : ""}</td>
                <td>
                  <ActionIcon variant="transparent">
                    <FaTrash
                      color="red"
                      onClick={() => {
                        setPlaces([...places.filter((p) => p.id !== place.id)]);
                      }}
                    />
                  </ActionIcon>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default LocationTable;
