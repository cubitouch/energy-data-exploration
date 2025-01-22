import { safeFetchData } from "../../utils/data_loader.js";
import { getQuery } from "./main.js";

(async () => safeFetchData(getQuery(90)))();