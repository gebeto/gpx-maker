import MapboxSdk from "@mapbox/mapbox-sdk";
import TileQuery from "@mapbox/mapbox-sdk/services/tilequery";
import MapiClient from "@mapbox/mapbox-sdk/lib/classes/mapi-client";

const orig = MapiClient.prototype.createRequest;

MapiClient.prototype.createRequest = function createRequest(requestOptions) {
  console.log(" >>> SDSDS", requestOptions);
  return orig.bind(this)({
    ...requestOptions,
    headers: {
      ...requestOptions.headers,
      accept: "*/*",
      "accept-language":
        "en-US,en;q=0.9,en-GB;q=0.8,zh-CN;q=0.7,zh;q=0.6,uk;q=0.5",
      origin: "https://gpx.studio",
      priority: "u=1, i",
      referer: "https://gpx.studio/",
    },
  });
};

const client = MapboxSdk({
  accessToken:
    "pk.eyJ1IjoidmNvcHBlIiwiYSI6ImNseWlrYXo0cjBocW0ya3F5MGtwM3A1b28ifQ.25xwq1HN121RHqM_zkWweQ",
  origin: "https://gpx.studio/",
});

const tilequery = TileQuery(client);
const res = tilequery
  .listFeatures({
    mapIds: ["mapbox.mapbox-terrain-dem-v1"],
    coordinates: [95.9345, 41.2565],
  })
  .send()
  .then((map) => {
    console.log(map.body.features);
  })
  .catch((err) => {
    console.error("Error fetching tile query:", err);
  });
