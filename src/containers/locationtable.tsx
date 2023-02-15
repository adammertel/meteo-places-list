import { ReactElement } from "react";

import { Badge, Button, Table } from "@mantine/core";

import {
  BiMessageSquareCheck,
  BiMessageSquareDots,
  BiMessageSquareError,
} from "react-icons/bi";
import { FaLink, FaTrash } from "react-icons/fa";
import { useRecoilState, useRecoilValue } from "recoil";
import api, { Api } from "../api";
import { IPlaceWeather, loadingState } from "../types";
import { colors } from "../variables";
import { PlacesWeather, SPlaces } from "./../states";

interface ILocationTable {}

/**
 * component for showing all the locations, their coordinates, weather and loading state in the table
 */
const LocationTable = ({}: ILocationTable): ReactElement => {
  const placesWeather = useRecoilValue(PlacesWeather);
  const [places, setPlaces] = useRecoilState(SPlaces);

  const statusIcon = (status: loadingState) => {
    switch (status) {
      case loadingState.LOADING:
        return <BiMessageSquareDots size={22} color={colors.warning} />;
      case loadingState.READY:
        return <BiMessageSquareCheck size={22} color={colors.success} />;
      case loadingState.FAILED:
        return <BiMessageSquareError size={22} color={colors.danger} />;
    }
  };

  return (
    <div className="container container-locationtable">
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
                <td>
                  <Badge
                    size="sm"
                    style={{
                      backgroundColor: colors.secondary,
                      color: colors.white,
                    }}
                  >
                    {place.id}
                  </Badge>
                </td>
                <td>{place.lat.toFixed(2)}</td>
                <td>{place.lng.toFixed(2)}</td>
                <td>{place.status && statusIcon(place.status)}</td>
                <td>{place.weather ? place.weather.temperature : ""}</td>
                <td className="td-actions">
                  <Button variant="light" color="red" compact>
                    <FaTrash
                      color={colors.danger}
                      onClick={() => {
                        setPlaces([...places.filter((p) => p.id !== place.id)]);
                      }}
                    />
                  </Button>
                  <Button variant="light" color="gray" compact>
                    <FaLink
                      color={colors.secondary}
                      onClick={() => {
                        window.open(
                          api.baseUrl + Api.meteoUrl(place.lat, place.lng),
                          "_blank"
                        );
                      }}
                    />
                  </Button>
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
