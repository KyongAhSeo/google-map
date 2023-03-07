import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { Autocomplete } from "@react-google-maps/api";
import { FaGenderless } from "react-icons/fa";
import { useRef, useState } from "react";

const SideDrawer = ({ setDirectionsResponse, error, setError }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef();
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef();
  const btnRef = useRef();

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [resultStatus, setResultStatus] = useState(false);

  async function calculateRoute() {
    if (originRef.current.value === "" || destinationRef.current.value === "") {
      return;
    }
    let results;
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();

    try {
      results = await directionsService.route({
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,
      });
      setResultStatus(true);
      setDirectionsResponse(results);
      setOrigin(results.request.origin.query);
      setDestination(results.request.destination.query);
      setDistance(results.routes[0].legs[0].distance.text);
      setDuration(results.routes[0].legs[0].duration.text);
    } catch (err) {
      setError(true);
      setResultStatus(false);
    }
  }

  function handleOpen() {
    onOpen();
    setError(false);
  }

  function clearRoute() {
    setError(false);
    setResultStatus(false);
    setDirectionsResponse(null);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destinationRef.current.value = "";
  }

  return (
    <>
      <Box textAlign="end">
        <Button ref={btnRef} colorScheme="teal" onClick={handleOpen} m={5}>
          Open
        </Button>
      </Box>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
        zIndex="1"
      >
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>길찾기</DrawerHeader>
          <DrawerBody>
            <Box>
              <Autocomplete>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<FaGenderless />}
                  />
                  <Input
                    type="text"
                    placeholder="출발지 입력"
                    ref={originRef}
                    defaultValue={setOrigin ? origin : null}
                  />
                </InputGroup>
              </Autocomplete>
              <Autocomplete>
                <InputGroup mt={2}>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<FaGenderless />}
                  />
                  <Input
                    type="text"
                    placeholder="도착지 입력"
                    ref={destinationRef}
                    defaultValue={setDestination ? destination : null}
                  />
                </InputGroup>
              </Autocomplete>

              <Box mt={2}>
                {error && (
                  <Text fontSize="sm" color="tomato">
                    검색 결과가 없습니다.
                  </Text>
                )}
              </Box>

              <Stack
                direction="row"
                my={3}
                align="center"
                justifyContent="space-between"
              >
                <Button colorScheme="blue" type="submit" onClick={clearRoute}>
                  다시입력
                </Button>
                <Button
                  colorScheme="pink"
                  type="submit"
                  onClick={calculateRoute}
                >
                  길찾기
                </Button>
              </Stack>
            </Box>
            {resultStatus && (
              <Box mt={5}>
                <Text fontSize="md">거리: {distance}</Text>
                <Text fontSize="md">걸리는 시간: {duration} </Text>
              </Box>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
