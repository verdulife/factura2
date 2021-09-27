<script>
  import { createWorker } from "tesseract.js";

  const worker = createWorker({
    logger: (m) => console.log(m),
  });

  (async () => {
    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const all = await worker.recognize("/invoice.png");
    console.log(all);
    await worker.terminate();
  })();
</script>
