import { compose, withState } from "recompose";

import DashboardView from "./Dashboard2";

export default compose(
  withState("mainChartState", "setMainChartState", "monthly")
)(DashboardView);
