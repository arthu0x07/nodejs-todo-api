import { createReadStream } from "node:fs/promises";
import { parse } from "csv-parse";

async function processCSV(filePath) {
  const stream = createReadStream(filePath);
  const parser = stream.pipe(
    parse({
      bom: true,
      columns: true,
      skip_empty_lines: true,
    })
  );

  for await (const record of parser) {
    console.log("Enviando:", record);
    try {
      const response = await fetch("http://localhost:3333/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });

      if (!response.ok) {
        throw new Error(`Erro ao enviar dados: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log("Resposta da API:", responseData);
    } catch (error) {
      console.error("Erro na requisição:", error);
    }

    setTimeout(() => {
      return;
    }, 3000);
  }
}

processCSV("./tasks-data-to-stream.csv").then(() =>
  console.log("Processamento concluído!")
);
