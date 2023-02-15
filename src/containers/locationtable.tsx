import { ReactElement } from "react";

import { Table } from "@mantine/core";

import { useRecoilValue } from "recoil";
import { IPlaceWeather } from "../types";
import { PlacesWeather } from "./../states";

interface ILocationTable {}

const LocationTable = ({}: ILocationTable): ReactElement => {
  const placesWeather = useRecoilValue(PlacesWeather);
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
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
};

export default LocationTable;
