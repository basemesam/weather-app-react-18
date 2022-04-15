import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Flex,
  Heading,
  Text,
  Select,
  Box,
  Grid,
  GridItem,
  ListItem,
  UnorderedList,
  Spinner,
  IconButton,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

const App: React.FC = () => {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [countries, setCountries] = useState<[]>([]);
  const [location, setLocation] = useState<string>("");

  const searchCountry = () => {
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=imperial&appid=895284fb2d2c50a520ea537456963d9c`
      )
      .then((response) => {
        setData(response.data);
      });
    setLocation("");
  };

  //Fetch Weather Data From API
  const fetchData = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position: any) => {
        const api = `lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
        const { data: response } = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?${api}&units=imperial&appid=895284fb2d2c50a520ea537456963d9c`
        );
        setData(response);
        setLoading(false);
      });
    }
  };

  //Fetch Countries API
  const fetchCountries = () => {
    axios.get(`https://restcountries.com/v3.1/all`).then((response) => {
      setCountries(response.data);
    });
  };

  useEffect(() => {
    fetchCountries();
    fetchData();
  }, []);

  return (
    <Box height="100vh">
      {loading ? (
        <Flex justifyContent="center" alignItems="center" height="100%">
          <Spinner color="#2f5d8a" />
        </Flex>
      ) : (
        <Container maxW="100%">
          <Flex flexDirection="column" pt="5rem">
            <Heading color="#2f5d8a" mb="1rem">
              Weather APP
            </Heading>
            <Flex justifyContent="space-between">
              <Select
                placeholder="Please Select Country"
                borderRadius="10px"
                width="95%"
                onChange={(e) => setLocation(e.target.value)}
              >
                {countries.map((country: any, index) => (
                  <option value={country.name?.common} key={index}>
                    {country.name?.common}
                  </option>
                ))}
              </Select>
              <IconButton
                onClick={searchCountry}
                aria-label="Search country"
                icon={<SearchIcon />}
              />
            </Flex>
            <Box
              boxShadow="rgb(0 0 0 / 10%) 1px 1px 3px"
              bg="#FFF"
              mt="1rem"
              padding="2rem"
              borderRadius="10px"
            >
              <Heading fontSize="1.125rem" color="#727e8e">
                Current Weather
              </Heading>
              <Heading fontSize="1.25rem" color="#396bae">
                {data?.name}
              </Heading>
              <Grid
                templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
                templateRows={{ base: "1fr", md: "repeat(auto-fill, 1fr)" }}
                gap="16px"
                mt="2rem"
              >
                <GridItem colSpan={{ base: 2, md: 1 }}>
                  <Flex alignItems="center">
                    <Box>
                      <img
                        src={`http://openweathermap.org/img/w/${data?.weather[0]?.icon}.png`}
                        alt="weather-icon"
                      />
                    </Box>
                    <Box fontSize="3rem" color="#4a6fa1" fontWeight="900">
                      {data?.main?.temp?.toFixed()}
                      <sup>o</sup>
                    </Box>
                  </Flex>
                  <Text
                    fontSize="1.275rem"
                    color="#7b98b2"
                    fontWeight="600"
                    textTransform="uppercase"
                  >
                    {data?.weather[0]?.description}
                  </Text>
                </GridItem>
                <GridItem colSpan={{ base: 2, md: 1 }}>
                  <Text fontSize="1.275rem" color="#7b98b2" mb="1rem">
                    Feels Like{" "}
                    <Box as="span">
                      {data?.main.feels_like?.toFixed()}
                      <sup>o</sup>
                    </Box>
                  </Text>
                  <UnorderedList>
                    <ListItem color="#3080c8" fontWeight="500" mb="0.5rem">
                      <Heading
                        fontSize="1.25rem"
                        color="#7b98b2"
                        fontWeight="400"
                        display="inline-block"
                        mr="12px"
                      >
                        Humidity
                      </Heading>{" "}
                      {data?.main?.humidity}%
                    </ListItem>
                    <ListItem color="#3080c8" fontWeight="500" mb="0.5rem">
                      <Heading
                        fontSize="1.25rem"
                        color="#7b98b2"
                        fontWeight="400"
                        display="inline-block"
                        mr="12px"
                      >
                        Wind
                      </Heading>{" "}
                      {data?.wind?.deg}kph
                    </ListItem>
                    <ListItem color="#3080c8" fontWeight="500" mb="0.5rem">
                      <Heading
                        fontSize="1.25rem"
                        color="#7b98b2"
                        fontWeight="400"
                        display="inline-block"
                        mr="12px"
                      >
                        Pressure
                      </Heading>{" "}
                      {data?.main?.pressure}hPa
                    </ListItem>
                  </UnorderedList>
                </GridItem>
              </Grid>
            </Box>
          </Flex>
        </Container>
      )}
    </Box>
  );
};

export default App;
