// national_parks_table.js

document.addEventListener("DOMContentLoaded", () => {
  // GET REFERENCES TO DOC ELEMENTS
  const locationDropdown = document.getElementById("location-dropdown");
  const parkTypeDropdown = document.getElementById("park-type-dropdown");
  const searchButton = document.getElementById("search-button");
  const viewAllButton = document.getElementById("view-all-button");
  const resultsDiv = document.getElementById("results"); // reference to #results div

  // POPULATE DROPDOWNS FROM ARRAYS
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

  // DISPLAY RESULTS FUNCTION WITH TABLE IMPLEMENTATION
  const displayResults = (parks) => {
    resultsDiv.innerHTML = ""; // CLEAR PREVIOUS RESULTS

    if (parks.length === 0) {
      resultsDiv.innerHTML =
        "<p>No parks found matching the selected criteria.</p>";
      return;
    }

    // CCREATE TABLE
    const table = document.createElement("table");
    table.setAttribute("border", "1"); // OPTIONAL: BORDER FOR VISIBILITY

    // CREATE THE TABLE HEADER ROW
    const headerRow = document.createElement("tr");

    // CREATE HEADER TITLES
    const headers = ["Park Name", "Location", "Address", "Phone", "Website"];
    headers.forEach((headerText) => {
      const th = document.createElement("th");
      th.textContent = headerText;
      headerRow.appendChild(th);
    });

    table.appendChild(headerRow);

    // CREATE A TABLE ROW FOR PARKS
    parks.forEach((park) => {
      const row = document.createElement("tr");

      // PARK NAME
      const nameCell = document.createElement("td");
      nameCell.textContent = park.LocationName;
      row.appendChild(nameCell);

      // PARK LOCATION (CITY, STATE)
      const locationCell = document.createElement("td");
      locationCell.textContent = `${park.City}, ${park.State}`;
      row.appendChild(locationCell);

      // ADDRESS
      const addressCell = document.createElement("td");
      addressCell.textContent = park.Address || "N/A";
      row.appendChild(addressCell);

      // PHONE
      const phoneCell = document.createElement("td");
      phoneCell.textContent = park.Phone || "N/A";
      row.appendChild(phoneCell);

      // WEBSITE LINK
      const websiteCell = document.createElement("td");
      if (park.Visit) {
        const link = document.createElement("a");
        link.href = park.Visit;
        link.target = "_blank";
        link.textContent = "Visit Park Website";
        websiteCell.appendChild(link);
      } else {
        websiteCell.textContent = "N/A";
      }
      row.appendChild(websiteCell);

      // ADD THE ROW TO THE TABLE
      table.appendChild(row);
    });

    // COMPLETE TABLE TO RESULTS DIV
    resultsDiv.appendChild(table);
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
