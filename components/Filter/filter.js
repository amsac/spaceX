import React, { useEffect, useState } from 'react';
import Button from '../CustomButton/button';

const possibleYearFilterValues = [{ year: '2006', isActive: false },
    { year: '2007', isActive: false },
    { year: '2008', isActive: false },
    { year: '2009', isActive: false },
    { year: '2010', isActive: false },
    { year: '2011', isActive: false },
    { year: '2012', isActive: false },
    { year: '2013', isActive: false },
    { year: '2014', isActive: false },
    { year: '2015', isActive: false },
    { year: '2016', isActive: false },
    { year: '2017', isActive: false },
    { year: '2018', isActive: false },
    { year: '2019', isActive: false },
    { year: '2020', isActive: false },
]

const possibleLaunchFilterValues= [{ launch: 'true', isActive: false }, { launch: 'false', isActive: false }]
const possibleLandingFilterValues = [{ landing: 'true', isActive: false }, { landing: 'false', isActive: false }]


const updateArray = (item, updatedvalue,key) => {
    if (item[key] == updatedvalue) {
        return { ...item, isActive: true }
    }
    else {
        return { ...item, isActive: false }
    }
}

function Filter(props) {
    const { yearProp,launchProp,landingProp, updateFilter} = props;
    const [year, setYear] = useState(possibleYearFilterValues);
    const [launch, setLaunch] = useState(possibleLaunchFilterValues);
    const [landing, setLanding] = useState(possibleLandingFilterValues);
    
    useEffect(() => {
        if (yearProp) {
            const updatedYear = year.map(y => updateArray(y, yearProp, 'year'));
            setYear(updatedYear);
      }
    }, [yearProp])
    
    useEffect(() => {
        if (launchProp) {
            const updatedLaunch = launch.map(lan => updateArray(lan, launchProp, 'launch')); 
            setLaunch(updatedLaunch); 
        }
    }, [launchProp])

    useEffect(() => {
        if (landingProp) {
            const updatedLanding = landing.map(l => updateArray(l, landingProp, 'landing'));
        setLanding(updatedLanding)
        }
        
    }, [landingProp])
    
    const ButtonFilterRender = (arr,key) => {
        return arr.map((y) => <Button
            key={y[key]}
            toUpdate={key}
            buttonText={y[key]}
            status={y.isActive}
            handleClick={updateFilter}
        />)
    }

    
  return (
      <div className="Filter">
          <h3>Filter</h3>
          <h5>Launch year</h5>
          <hr />
          <div className="Filter-Btns">
              {year && year.length > 0 && ButtonFilterRender(year,'year') }
          </div>
          <h5>Successful Launch</h5>
          <hr />
          <div className="Filter-Btns">
              {launch && launch.length > 0 && ButtonFilterRender(launch,'launch')}
          </div>
          <h5>Successful Landing</h5>
          <hr />
          <div className="Filter-Btns">
              {landing && landing.length > 0 && ButtonFilterRender(landing,'landing')}
          </div>
      </div>
  );
}

export default React.memo(Filter);
