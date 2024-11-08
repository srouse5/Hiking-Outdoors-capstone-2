// national_parks.js

document.addEventListener("DOMContentLoaded", () => {
  // GET REFERENCES TO DOM ELEMENTS
  const locationDropdown = document.getElementById("location-dropdown");
  const parkTypeDropdown = document.getElementById("park-type-dropdown");
  const searchButton = document.getElementById("search-button");
  const viewAllButton = document.getElementById("view-all-button");
  const resultsDiv = document.getElementById("results"); // reference to #results div

  // POPULATE DROPDOWNS WITH DATA FROM ARRAYS
  locationsArray.forEach((location) => {
    const option = document.createElement("option");
    option.value = location;
    option.textContent = location;
    locationDropdown.appendChild(option);
  });

  // POPULATE PARK TYPE DROPDOWN WITH DATA FROM ARRAY
  parkTypesArray.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    parkTypeDropdown.appendChild(option);
  });

  // SEARCH FUNCTION
  const searchParks = () => {
    const selectedLocation = locationDropdown.value;
    const selectedParkType = parkTypeDropdown.value;

    // DISPLAY MESSAGE IF NO FILTERS ARE SELECTED
    if (!selectedLocation && !selectedParkType) {
      resultsDiv.innerHTML =
        "<p>Please select at least one filter option (Location or Park Type) to search.</p>";
      return;
    }

    // FILTER PARKS BASED ON SELECTED CRITERIA
    let filteredParks = nationalParksArray.filter((park) => {
      const matchesLocation = selectedLocation
        ? park.State === selectedLocation
        : true;
      const matchesType = selectedParkType
        ? park.LocationName.toLowerCase().includes(
            selectedParkType.toLowerCase()
          )
        : true;
      return matchesLocation && matchesType;
    });

    displayResults(filteredParks);
  };

  // VIEW ALL PARKS FUNCTION
  const viewAllParks = () => {
    displayResults(nationalParksArray);
  };

  // DISPLAY RESULTS FUNCTION
  const displayResults = (parks) => {
    resultsDiv.innerHTML = ""; // CLEAR PREVIOUS RESULTS
    if (parks.length === 0) {
      resultsDiv.innerHTML =
        "<p>No parks found matching the selected criteria.</p>";
      return;
    }

    parks.forEach((park) => {
      const parkDiv = document.createElement("div");
      parkDiv.classList.add("park-result");
      parkDiv.innerHTML = `
        <h3>${park.LocationName}</h3>
        <p><strong>Location:</strong> ${park.City}, ${park.State}</p>
        <p><strong>Address:</strong> ${park.Address || "N/A"}</p>
        <p><strong>Phone:</strong> ${park.Phone || "N/A"}</p>
        ${
          park.Visit
            ? `<p><a href="${park.Visit}" target="_blank">Visit Park Website</a></p>`
            : ""
        }
      `;
      resultsDiv.appendChild(parkDiv);
    });
  };

  // CLEAR RESULTS FUNCTION
  const clearResults = () => {
    resultsDiv.innerHTML = ""; // CLEARS RESULTS DIV
    locationDropdown.value = ""; // RESET DROPDOWN VALUES
    parkTypeDropdown.value = "";
  };

  // EVENT LISTENERS
  searchButton.addEventListener("click", searchParks);
  viewAllButton.addEventListener("click", viewAllParks);
  document
    .getElementById("clear-results-button")
    .addEventListener("click", clearResults);
});
