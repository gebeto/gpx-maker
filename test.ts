import MapboxSdk from "@mapbox/mapbox-sdk";
import TileQuery from "@mapbox/mapbox-sdk/services/tilequery";

const client = MapboxSdk({
  accessToken:
    "pk.eyJ1IjoidmNvcHBlIiwiYSI6ImNseWlrYXo0cjBocW0ya3F5MGtwM3A1b28ifQ.25xwq1HN121RHqM_zkWweQ",
  origin: "https://gpx.studio",
});

const tilequery = TileQuery(client);
const res = tilequery
  .listFeatures({
    mapIds: [],
    coordinates: [95.9345, 41.2565],
  })
  .send()
  .then((map) => {
    console.log(map.body.features);
  })
  .catch((err) => {
    console.error("Error fetching tile query:", err);
  });
