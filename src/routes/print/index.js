import PDFDocument from "pdfkit";
import SVGtoPDF from "svg-to-pdfkit";
import { bill } from "./assets/bill.svg";

PDFDocument.prototype.svg = function (svg, x, y, options) {
  return SVGtoPDF(this, svg, x, y, options), this;
};

const mm = (size) => size * 2.83465;

export async function post(req, res) {
  const data = req.body;

  console.log(data);

  const doc = new PDFDocument({
    size: [mm(210), mm(297)],
    margin: 0,
    /* info: {
      Title: `Factura_${data.number}_${data.client.legal_id}`,
    }, */
  });

  /* const font_req = (await fetch(req.headers.origin + "/fira.ttf")) || (await fetch(req.headers.origin + "/static/fira.ttf"));
  const font = await font_req.arrayBuffer();
  doc.font(font).fontSize(8); */

  doc.svg(bill, 0, 0, {
    width: mm(210),
    height: mm(297),
  });

  /* doc.text(data.number, mm(168), mm(31));
  doc.text(`${data.date.day}/${data.date.month}/${data.date.year}`, mm(168), mm(36));

  doc.text(data.client.legal_name, mm(34.5), mm(66.7));
  doc.text(data.client.legal_id, mm(163.5), mm(66.7));
  doc.text(data.client.address, mm(42), mm(74));
  doc.text(data.client.contact, mm(163.5), mm(74));

  for (let l = 0; l < data.items.length; l++) {
    const line = data.items[l];
    const jump = mm(5.5) * l;
    const with_dto = (line.price * (line.dto > 0 ? line.dto : 100)) / 100;
    const line_total = (line.price - (line.dto > 0 ? with_dto : 0)) * line.amount;
    doc.text(line.amount, mm(27), mm(97) + jump);
    doc.text(line.label, mm(38), mm(97) + jump);
    doc.text(`${line.dto}%`, mm(139), mm(97) + jump);
    doc.text(`${line.price.toFixed(2)}€`, mm(150), mm(97) + jump);
    doc.text(`${line_total.toFixed(2)}€`, mm(168), mm(97) + jump);
  }

  doc.text(`${data.totals.base.toFixed(2)}€`, mm(63.5), mm(238));
  if (data.totals.ret > 0) doc.text(`-${data.totals.ret.toFixed(2)}€`, mm(96), mm(238));
  doc.text(`${data.totals.iva.toFixed(2)}€`, mm(128), mm(238));
  doc.fillColor("#fff").text(`${data.totals.total.toFixed(2)}€`, mm(154), mm(238)); */

  res.statusCode = 200;
  res.setHeader("Content-type", "application/pdf");
  res.setHeader("Content-disposition", `attachment; filename=${data.title}.pdf`);

  doc.pipe(res);

  doc.end();
}
