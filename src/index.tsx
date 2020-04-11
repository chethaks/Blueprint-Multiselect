import * as React from "react";
import { render } from "react-dom";

import { BluePrintMultiSelect } from './BluePrintMultiSelect';

import "normalize.css";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
import "@blueprintjs/select/lib/css/blueprint-select.css";
import "./style.css";



const App = () => <BluePrintMultiSelect />

const rootElement = document.getElementById('root');
render(<App />, rootElement);