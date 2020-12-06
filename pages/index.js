import styles from "../styles/Home.module.css";
import axios from "axios";
import { Container, Row, Col,Spinner } from "reactstrap";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import FlightCard from '../components/FlightCard/flightCard'
import Filter from '../components/Filter/filter'

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
    <Container className={styles.ProgramsWindow} fluid>
      <Row xl="12">
        <Col>
          <h2>Space X Launch Programs</h2>
        </Col>
      </Row>
      <Row xs="12" sm="12">
        <Col xs="12" sm="4" md="3">
          <Filter
            updateFilter={(key, value) => updateActiveFilterState(key, value)}
            yearProp={programs.year}
            launchProp={programs.launch}
            landingProp={programs.landing}
          />
        </Col>
        <Col xs="12" sm="8" md="9">
          <Row xs="12" sm="8">
            {programs &&
              programs.length > 0 &&
              programs.map(program => (
                <Col md="3" sm="6" xs="12" className={styles.cardSeperator}>
                  <FlightCard
                    missionName={program.mission_name}
                    flightNumber={program.flight_number}
                    imageURL={program.links.mission_patch_small}
                    missionIds={program.mission_id}
                    launchYear={program.launch_year}
                    launchSuccess={
                      program.launch_success === null
                        ? ""
                        : program.launch_success.toString()
                    }
                    launchLanding={
                      program.rocket.first_stage.cores[0].land_success === null
                        ? ""
                        : program.rocket.first_stage.cores[0].land_success.toString()
                    }
                  />
                </Col>
              ))}

            {loading && (
              <Col>
                <Spinner color="dark" />
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
      <Row xl="12" ><Col><h2>Developed by Akhil Vinayak MS</h2></Col></Row>
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
