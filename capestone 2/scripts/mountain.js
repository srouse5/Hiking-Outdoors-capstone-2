
// Function that can "fetch" the sunrise/sunset times
async function getSunsetForMountain(lat, lng) {
  let response = await fetch(
    `https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&date=today`
  );
  let data = await response.json();
  return data;
}

document.addEventListener("DOMContentLoaded", () => {
  const mountainSelect = document.getElementById("mountainSelect");
  const mountainInfoContainer = document.getElementById("mountain-info");
  const searchMountainButton = document.getElementById(
    "search-mountain-button"
  );

  // POPULATE MOUNTAIN SELECT DROPDOWN WITH DATA FROM ARRAY
  mountainsArray.forEach((mountain) => {
    const option = document.createElement("option");
    option.value = mountain.name;
    option.textContent = mountain.name;
    mountainSelect.appendChild(option);
  });

  // DISPLAY MOUNTAIN INFORMATION IN A TABLE FORMAT
  const viewMountain = () => {
    const selectedMountain = mountainSelect.value;
    const mountain = mountainsArray.find((m) => m.name === selectedMountain);

    if (mountain) {
      mountainInfoContainer.innerHTML = `
        <div class="result-box">
          <h3>${mountain.name}</h3>
          <table border="1" style="width: 100%; border-collapse: collapse; margin-bottom: 10px;">
            <tr>
              <th style="padding: 8px; text-align: left;">Elevation</th>
              <td style="padding: 8px;">${mountain.elevation} feet</td>
            </tr>
            <tr>
              <th style="padding: 8px; text-align: left;">Difficulty</th>
              <td style="padding: 8px;">${mountain.effort}</td>
            </tr>
            <tr>
              <th style="padding: 8px; text-align: left;">Description</th>
              <td style="padding: 8px;">${mountain.desc}</td>
            </tr>
            <tr>
              <th style="padding: 8px; text-align: left;">Image</th>
              <td style="padding: 8px;">
                ${
                  mountain.img
                    ? `<img src="../images/${mountain.img}" alt="${mountain.name}" style="max-width: 500px; height: auto;" />`
                    : "N/A"
                }
              </td>
            </tr>
          </table>
          <h4>Today's Sunrise and Sunset</h4>
          <table id="sunrise-sunset-table" border="1" style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <tr>
              <th style="padding: 8px; text-align: left;">Sunrise</th>
              <td id="sunrise-time" style="padding: 8px;">Fetching data...</td>
            </tr>
            <tr>
              <th style="padding: 8px; text-align: left;">Sunset</th>
              <td id="sunset-time" style="padding: 8px;">Fetching data...</td>
            </tr>
          </table>
        </div>
      `;

      // FETCH SUNRISE AND SUNSET TIMES FOR MOUNTAIN
      displaySunriseSunset(mountain.coords.lat, mountain.coords.lng);
    } else {
      mountainInfoContainer.innerHTML = `<p>Please select a mountain to view its information.</p>`;
    }
  };

  // Function to get data from the API and display the converted times
  const displaySunriseSunset = async (lat, lng) => {
    try {
      const data = await getSunsetForMountain(lat, lng);

      if (data.status === "OK") {
        let { sunrise, sunset } = data.results;

        // Convert sunrise and sunset from 12-hour to 24-hour format for UTC parsing
        const sunriseUTC = new Date(
          `1970-01-01T${convertTo24HourFormat(sunrise)}Z`
        );
        const sunsetUTC = new Date(
          `1970-01-01T${convertTo24HourFormat(sunset)}Z`
        );

        const options = {
          timeZone: "America/New_York", // Converts to Eastern Time Zone
          hour12: true,
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        };

        const sunriseEST = new Intl.DateTimeFormat("en-US", options).format(
          sunriseUTC
        );
        const sunsetEST = new Intl.DateTimeFormat("en-US", options).format(
          sunsetUTC
        );

        // Display the converted times in the table cells
        document.getElementById(
          "sunrise-time"
        ).textContent = `${sunriseEST} EST`;
        document.getElementById("sunset-time").textContent = `${sunsetEST} EST`;
      } else {
        document.getElementById("sunrise-time").textContent =
          "Unable to retrieve";
        document.getElementById("sunset-time").textContent =
          "Unable to retrieve";
      }
    } catch (error) {
      console.error("Error details:", error);
      document.getElementById("sunrise-time").textContent =
        "Error fetching time";
      document.getElementById("sunset-time").textContent =
        "Error fetching time";
    }
  };

  // Helper function to convert 12-hour format (AM/PM) to 24-hour format for Date parsing
  const convertTo24HourFormat = (time) => {
    const [timePart, modifier] = time.split(" ");
    let [hours, minutes, seconds] = timePart.split(":");

    if (modifier === "PM" && hours !== "12") {
      hours = String(parseInt(hours, 10) + 12);
    } else if (modifier === "AM" && hours === "12") {
      hours = "00";
    }

    return `${hours}:${minutes}:${seconds}`;
  };

  // CLEAR RESULTS
  const clearResults = () => {
    mountainInfoContainer.innerHTML = "";
    mountainSelect.value = ""; // Reset dropdown selection
  };

  // EVENT LISTENERS
  searchMountainButton.addEventListener("click", viewMountain);

  // Make the clearResults function globally accessible
  window.clearResults = clearResults;
});