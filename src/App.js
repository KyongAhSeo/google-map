import { Box, Flex, IconButton, SkeletonText } from "@chakra-ui/react";
import { FaLocationArrow } from "react-icons/fa";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useState } from "react";
import "./App.scss";
import SideDrawer from "./components/SideDrawer";

// 현재위치
const center = { lat: 40.416775, lng: -3.70379 };

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [map, setMap] = useState(/** @type google.maps.Map */ (null));
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [error, setError] = useState(false);

  if (!isLoaded) {
    return <SkeletonText />;
  }

  return (
    <Flex position="relative" flexDirection="column" h="100vh" w="100vw">
      <Box position="absolute" left={0} top={0} h="100%" w="100%">
        {/* Google Map Box */}
        <GoogleMap
          center={center}
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={(map) => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </Box>

      <Box position="absolute" right={0} bottom={0}>
        <IconButton
          m={5}
          aria-label="center back"
          icon={<FaLocationArrow />}
          isRound
          onClick={() => {
            map.panTo(center);
            map.setZoom(15);
          }}
        />
      </Box>

      <SideDrawer
        setDirectionsResponse={setDirectionsResponse}
        error={error}
        setError={setError}
      />
    </Flex>
  );
}

export default App;
