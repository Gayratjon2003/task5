import React, { useState, useEffect } from "react";
import { faker, allFakers } from "@faker-js/faker";

const regions = [
  {
    country: "USA",
    code: "en_US",
  },
  {
    country: "Russia",
    code: "ru",
  },
  {
    country: "Germany",
    code: "de",
  },
];

const generateRandomData = (region, count, dataLength) => {
  const data = [];
  for (let i = 1; i <= count; i++) {
    const randomIdentifier = faker.string.uuid();

    const fullName = allFakers[region].person.fullName();

    const city = allFakers[region].location.city();
    const street = allFakers[region].location.street();
    const house = allFakers[region].location.secondaryAddress();
    const address = ` ${city}, ${street}, ${house}`;
    let phone = allFakers[region].phone.number();
    if (region === "ru") {
      phone = faker.phone.number("+7 ### ######");
    }
    let id = dataLength + i;
    let errorData = { id, randomIdentifier, fullName, address, phone };

    data.push(errorData);
  }

  return data;
};

const App = () => {
  const [region, setRegion] = useState(regions[0].code);
  const [errorCount, setErrorCount] = useState(0);
  const [seed, setSeed] = useState("");
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    setData(generateRandomData(region, 20, data.length));
  }, [region]);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    const newData = [...data, ...generateRandomData(region, 10, data.length)];
    setData(newData);
  }, [page]);
  const handleRegionChange = (event) => {
    setRegion(event.target.value);
    setErrorCount(0);
    setCurrentPage(0);
    setData([])
  };

  const handleSliderChange = (event) => {
    setErrorCount(Number(event.target.value));
    setCurrentPage(Number(event.target.value));
  };

  const handleSeedChange = (event) => {
    setSeed(event.target.value);
  };

  const handleRandomSeed = () => {
    setSeed(faker.string.uuid());
    const newData = [...data, ...generateRandomData(region, 10, data.length)];
    setData(newData);
  };
  const itemsPerPage = 10;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div style={{ paddingBottom: "100px" }}>
      <h1>Fake User Data Generator</h1>
      <label>
        Region:
        <select
          value={region}
          onChange={handleRegionChange}
          style={{ marginLeft: "10px" }}
        >
          {regions.map((region) => (
            <option key={region.code} value={region.code}>
              {region.country}
            </option>
          ))}
        </select>
      </label>
      <br />
      <label>
        Error Count:
        <input
          type="range"
          min="0"
          max={Math.ceil(data.length / itemsPerPage)}
          value={errorCount}
          onChange={handleSliderChange}
          style={{ marginLeft: "10px" }}
        />
        {errorCount}
      </label>
      <br />
      <label>
        Seed:
        <input
          type="text"
          value={seed}
          onChange={handleSeedChange}
          style={{ marginLeft: "10px" }}
        />
        <button onClick={handleRandomSeed}>Random</button>
      </label>
      <br />
      <table cellPadding="10px">
        <thead>
          <tr>
            <th>Index</th>
            <th>Random Identifier</th>
            <th>Name</th>
            <th>Address</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((record) => (
            <tr key={record.id}>
              <td>{record.id}</td>
              <td>{record.randomIdentifier}</td>
              <td>{record.fullName}</td>
              <td>{record.address}</td>
              <td>{record.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
