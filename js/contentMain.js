import currency from "./lib/currency.js";

let oRate = 1500.14;

export async function main({ rate }) {
  console.log(currency);
  traverse(document.body);
  console.log("done");

  function traverse(root) {
    for (let node of root.childNodes) {
      if (
        node.childNodes.length === 1 &&
        node.childNodes[0].nodeType === Node.TEXT_NODE &&
        node.innerText
      ) {
        let val = node.innerText.match(/LBP(\ )?[\d,]+(\.\d*)?/);
        if (val && val[0]) {
          let o = currency(val[0]).divide(oRate);
          let c = currency(val[0]).divide(rate);
          node.innerText += ` (${o.format(true)}/${c.format(true)})`;
        }
        continue;
      }

      traverse(node);
    }
  }
}
