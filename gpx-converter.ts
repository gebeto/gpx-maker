import { parse } from "node-html-parser";
import fs from "fs";
import Handlebars from "handlebars";
import crypto from "crypto";

const generateMD5Hash = (str: string) => {
  return crypto.createHash("md5").update(str).digest("hex");
};

const cachedFetch = async (url: string) => {
  const hash = generateMD5Hash(url);
  if (!fs.existsSync(`./cache/${hash}.html`)) {
    const response = await fetch(url);
    const data = await response.text();
    fs.writeFileSync(`./cache/${hash}.html`, data, "utf-8");
  }
  return fs.readFileSync(`./cache/${hash}.html`, "utf-8");
};

const gpxTemplate = Handlebars.compile(
  fs.readFileSync("./template.hbs", "utf-8")
);

const getRouteData = async (url: string) => {
  const data = await cachedFetch(url);
  const document = parse(data);
  const code =
    document.querySelector("script[language='javascript']")?.textContent ?? "";
  const rawTitle = document.querySelector("title")?.textContent ?? "";
  const title = rawTitle
    .replace('. На сайті "В Похід Карпатами"', "")
    .replace(/[\.«]/g, " ")
    .replace(/^Маршрут\s/, "")
    .trim();
  const func = new Function(code + "\nreturn list;");
  return {
    title: title,
    path: func(),
  };
};

const extractGpx = async (url: string) => {
  const routeData = await getRouteData(url);

  const res = gpxTemplate({
    title: routeData.title,
    points: routeData.path,
  });

  fs.writeFileSync(`./raw-routes/${routeData.title}.gpx`, res, "utf-8");
};

const extractAllGpx = async () => {
  for (let i = 0; i <= 140; i++) {
    const url = `https://vpohid.com.ua/routes/v/route/${i}/`;
    try {
      console.log(`Start ${i}.`);
      await extractGpx(url);
      console.log(`Route ${i} extracted successfully.`);
    } catch (error) {
      console.error(`Failed to extract route ${url}:`);
    }
  }
};

(async () => {
  // extractGpx("https://vpohid.com.ua/routes/v/route/70/");
  extractAllGpx();
})();
