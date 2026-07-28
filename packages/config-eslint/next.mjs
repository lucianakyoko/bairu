import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

import base from "./base.mjs";

export default [...base, ...nextVitals, ...nextTs];
