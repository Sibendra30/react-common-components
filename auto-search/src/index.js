import React from "react";
import { render } from "react-dom";
import Home from './home';

require("./styles.css");

const container = document.createElement("div");
document.body.appendChild(container);
render(<Home />, container);
