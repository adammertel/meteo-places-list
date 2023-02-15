# meteo-places-list

A simple application whose primary goal may be to check how Recoil handles the async setters (?).

### Technologies

The application is written in React + TS + Recoil and with Mantine UI components, Deck.gl map, and React-icons.

### Idea

The application allows the user to create a list of geographic places by manually entering coordinates, clicking on the map, or using the button to add a place with random coordinates. After a new place is added, a timeout operation (with a randomly assigned waiting time) runs a request on the [open-meteo API](https://api.open-meteo.com) - asking for a weather situation for the coordinate values representing the added place. After a successful request, the application shows the actual temperature for the given place.

### Layout

The application has a simple layout consisting of a map (deck.gl), a short form with buttons, and a list of already-created places.

- (i) **The map** shows the position of the actual coordinates in the (ii) form displayed with a blue map point. Other black map points show the coordinates of the already-added places
- (ii) **The form** consists of two number inputs for assigning latitude and longitude values. Under the inputs, three buttons are located. The first button adds a new place taking the longitude and longitude value from the input fields (symbolized by the blue marker on the map(i)). The second button adds a new place with random (but valid) coordinates, while the last one adds a place with a non-valid coordinate. The reasoning behind the last button is just testing.
- (iii) **The table** consists of columns for the (self-assigned) identifier, coordinates, weather call status, temperature, and two actions - delete the particular place and open the specific API call in a new tab. The weather status may have three states - loading (orange), success (green), and failed (red) indicated by an icon with a color representing the current state. The temperature column has value only in the case of the success state.

### Run

The application was prototyped with react-create-app; therefore, the local development and build process are pretty straightforward. To develop on a local computer, just run `yarn start`; for doing the build process with the standard outcome folder (dist), run `yarn build` and use `yarn run build-docs` to build the application in the `docs` folder, which is on `git merge` exposed as a [github public page](https://adammertel.github.io/meteo-places-list/).
