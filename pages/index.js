import styles from "../styles/Home.module.css";
import axios from "axios";
import { Container, Row, Col } from "reactstrap";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import FlightCard from '../components/FlightCard/flightCard'

export const baseSpacexUrl = "https://api.spacexdata.com/v3/launches";
export default function Home(props) {
  const router = useRouter();
  const { land_success, launch_success, launch_year } = router.query;
  const [launches, setLaunches] = useState(props.launches);
  const initialFilterState = {
    launchYear: launch_year ? launch_year : "",
    launch: launch_success ? launch_success : "",
    landing: land_success ? land_success : ""
  };
  const [activeFilters, setActiveFilters] = useState(initialFilterState);
  const [programs, setPrograms] = useState(launches);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const yearFilterValue = launch_year ? launch_year : "";
    const launchFilterValue = launch_success ? launch_success : "";
    const landingFilterValue = land_success ? land_success : "";
    setLoading(true);
    axios
      .get(
        `${baseSpacexUrl}?limit=100&launch_year=${yearFilterValue}&launch_success=${launchFilterValue}&land_success=${landingFilterValue}`
      )
      .then(result => {
        setPrograms(result.data);
        setLoading(false);
      });
  }, [land_success, launch_success, launch_year]);

  // console.log(launches);
  const updateActiveFilterState = (selectedFilter, value) => {
    // console.log(key, value);

    setActiveFilters(prevState => ({
      ...prevState,
      [selectedFilter]: value
    }));
    const selectedYear =
      selectedFilter === "year" && value ? value : launch_year;
    const selectedLanding =
      selectedFilter === "landing" && value ? value : land_success;
    const selectedLaunch =
      selectedFilter === "launch" && value ? value : launch_success;

    router.push(
      `/?launch_success=${selectedLaunch ? selectedLaunch : ""}&land_success=${
        selectedLanding ? selectedLanding : ""
      }&launch_year=${selectedYear ? selectedYear : ""}`,
      undefined,
      { shallow: true }
    );
  };
  return (
    <Container className={styles.ProgramsWindow}>
      <Row xl="12">
        <Col>
          <h2>Space X Launch Programs</h2>
        </Col>
      </Row>
      <Row xs="12" sm="12">
        <Col xs="12" sm="4" md="3">
          {/* <Filter
            updateFilter={(key, value) => updateFilterState(key, value)}
            yearProp={filter.year}
            launchProp={filter.launch}
            landingProp={filter.landing}
          /> */}
        </Col>
        <Col xs="12" sm="8" md="9">
          <Row xs="12" sm="8">
            {programs &&
              programs.length > 0 &&
              programs.map(f => (
                <Col md="3" sm="6" xs="12" className={styles.padtop}>
                  <FlightCard
                    missionName={f.mission_name}
                    flightNumber={f.flight_number}
                    imageURL={f.links.mission_patch_small}
                    missionIds={f.mission_id}
                    launchYear={f.launch_year}
                    launchSuccess={
                      f.launch_success === null
                        ? ""
                        : f.launch_success.toString()
                    }
                    launchLanding={
                      f.rocket.first_stage.cores[0].land_success === null
                        ? ""
                        : f.rocket.first_stage.cores[0].land_success.toString()
                    }
                  />
                </Col>
              ))}

            {loading && (
              <Col>
                <h4>Loading...........</h4>
              </Col>
            )}
            {!loading && programs.length === 0 && (
              <Col>
                <h4>No Data</h4>
              </Col>
            )}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
export async function getStaticProps() {
  const ssoData = await axios.get(`${baseSpacexUrl}?limit=100`);
  return {
    props: {
      launches: ssoData.data
    }
  };
}
