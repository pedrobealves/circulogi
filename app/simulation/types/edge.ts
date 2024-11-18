import * as vNG from "v-network-graph";

export interface Edge extends vNG.Edge {
  width: number;
  color: string;
  dashed?: boolean;
}
