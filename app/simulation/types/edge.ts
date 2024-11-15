import * as vNG from "v-network-graph";

interface Edge extends vNG.Edge {
  width: number;
  color: string;
  dashed?: boolean;
}
