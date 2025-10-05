import { limparProcessosIncompletosCron } from "./limparProcessosIncompletosCron";
import { verificarAnoLetivoCron } from "./verificarAnoLetivoCron";

export function cronsDoSistema() {
  limparProcessosIncompletosCron();
  verificarAnoLetivoCron();
}
