import styles from "../styles/Home.module.css";
import axios from "axios";
import { Container, Row, Col } from "reactstrap";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

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
    console.log(key, value);

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
    <Container>
      <Row xl="12">
        <Col>
          <h2>Space X Launch Program</h2>
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
