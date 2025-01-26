import { safeFetchData } from "../../utils/data-loader.js";
import { getQuery } from "./main.js";

(async () => safeFetchData(getQuery(30)))();