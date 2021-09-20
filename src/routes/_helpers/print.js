import PDFDocument from "pdfkit";
import SVGtoPDF from "svg-to-pdfkit";
import { resolve } from "path";

const mm = (size) => size * 2.83465;
const type = resolve(process.cwd(), "static", "fonts", "OperatorMonoLig-Medium.ttf");

PDFDocument.prototype.svg = function (svg, x, y, options) {
  return SVGtoPDF(this, svg, x, y, options), this;
};

export function post(req, res, next) {
  const data = req.body;
  const doc = new PDFDocument({
    size: [mm(210), mm(297)],
    margin: 0,
    info: {
      Title: `${data.title}`,
    },
  });

  res.statusCode = 200;
  res.setHeader("Content-type", "application/pdf");
  res.setHeader("Content-disposition", `attachment; filename=${data.title}.pdf`);

  doc.pipe(res);

  doc.end();
}
