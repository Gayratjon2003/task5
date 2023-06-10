import React, { useState, useEffect, useRef } from "react";
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

function App() {
  const [region, setRegion] = useState(regions[0].code);
  const [errorAmount, setErrorAmount] = useState(0);
  const [seed, setSeed] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const tableRef = useRef(null);

  const pageSize = 20;

  const generateUserData = () => {
    const generatedUsers = [];

    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    for (let i = startIndex; i < endIndex; i++) {
      const identifier = faker.string.uuid();
      const name = allFakers[region].person.fullName();
      const city = allFakers[region].location.city();
      const street = allFakers[region].location.street();
      const house = allFakers[region].location.secondaryAddress();
      const address = ` ${city}, ${street}, ${house}`;
      let phone = allFakers[region].phone.number();
      if (region === "ru") {
        phone = faker.phone.number("+7 ### ######");
      }

      let errorAppliedName = name;
      let errorAppliedAddress = address;
      let errorAppliedPhone = phone;

      for (let j = 0; j < errorAmount; j++) {
        const randomErrorType = Math.floor(Math.random() * 3);

        switch (randomErrorType) {
          case 0:
            const deleteIndex = Math.floor(
              Math.random() * errorAppliedName.length
            );
            errorAppliedName =
              errorAppliedName.substring(0, deleteIndex) +
              errorAppliedName.substring(deleteIndex + 1);
            break;
          case 1:
            const randomChar = String.fromCharCode(
              Math.floor(Math.random() * 26) + 97
            );
            const insertIndex = Math.floor(
              Math.random() * errorAppliedAddress.length
            );
            errorAppliedAddress =
              errorAppliedAddress.substring(0, insertIndex) +
              randomChar +
              errorAppliedAddress.substring(insertIndex);
            break;
          case 2:
            const swapIndex = Math.floor(
              Math.random() * (errorAppliedPhone.length - 1)
            );
            const charArray = errorAppliedPhone.split("");
            const temp = charArray[swapIndex];
            charArray[swapIndex] = charArray[swapIndex + 1];
            charArray[swapIndex + 1] = temp;
            errorAppliedPhone = charArray.join("");
            break;
          default:
            break;
        }
      }

      generatedUsers.push({
        seed: seed,
        index: users.length + i,
        identifier,
        name: errorAppliedName,
        address: errorAppliedAddress,
        phone: errorAppliedPhone,
      });
    }

    return generatedUsers;
  };

  const handleRegionChange = (e) => {
    setRegion(e.target.value);
    setPageNumber(1);
  };

  const handleErrorAmountChange = (e) => {
    setErrorAmount(parseInt(e.target.value));
  };

  const handleSeedChange = (e) => {
    setSeed(e.target.value);
    setPageNumber(1);
  };

  const handleRandomSeedClick = () => {
    const randomSeed = Math.random().toString(36).substring(2, 10);
    setSeed(randomSeed);
    setPageNumber(1);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  };
  useEffect(() => {
    const generatedUsers = generateUserData();
    setUsers((prevUsers) => [...prevUsers, ...generatedUsers]);
  }, [region, errorAmount, seed, pageNumber, page]);

  useEffect(() => {
    setUsers([]);
    tableRef.current.scrollTo(0, 0);
  }, [region, errorAmount]);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  console.log("users: ", users);
  return (
    <div className="app">
      <div className="controls">
        <label>
          Region:
          <select value={region} onChange={handleRegionChange}>
            {regions.map((region) => (
              <option value={region.code} key={region.code}>
                {region.country}
              </option>
            ))}
          </select>
        </label>
        <label>
          Error Amount:
          <input
            type="range"
            min="0"
            max="10"
            value={errorAmount}
            onChange={handleErrorAmountChange}
          />
          <input
            type="number"
            min="0"
            max="1000"
            value={errorAmount}
            onChange={handleErrorAmountChange}
          />
        </label>
        <label>
          Seed:
          <input type="text" value={seed} onChange={handleSeedChange} />
          <button onClick={handleRandomSeedClick}>Random</button>
        </label>
      </div>
      <div className="table" onScroll={handleScroll} ref={tableRef}>
        <table>
          <thead>
            <tr>
              <th>Index</th>
              <th>Identifier</th>
              <th>Name</th>
              <th>Address</th>
              <th>Phone</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => {
              if (user?.seed === seed) {
                return (
                  <tr key={user.identifier}>
                    <td>{user.index + 1}</td>
                    <td>{user.identifier}</td>
                    <td>{user.name}</td>
                    <td>{user.address}</td>
                    <td>{user.phone}</td>
                  </tr>
                );
              }
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
