import { GoogleGenerativeAI } from "@google/generative-ai";

// Inicializar cliente Gemini com a API key
const genAI = new GoogleGenerativeAI("AIzaSyA-tVWZzDsN4qlWQdLD11tgtMUUQ0p1Zc4");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

function cleanJsonString(str) {
  return str
    .replace(/```json/g, "") // remove ```json
    .replace(/```/g, "") // remove ```
    .trim();
}

// Função que gera notícias específicas para uma categoria
export async function getNewsByCategory(category) {
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const prompt = `
Good morning! Today is ${formattedDate}.
Search the top news websites in World and return the 5 most important news articles of the day in the "${category}" category.

Respond ONLY with a valid JSON array in the following format — no markdown, no extra text, no code fences, no explanations , no types like \`\`\`json':

[
  {
    "title": "News title",
    "shortDescription": "Brief summary of the news",
    "description": "Full description of the news",
    "source": "News outlet or publisher",
    "date": "Publication date in YYYY-MM-DD format",
    "link": "link da noticia"
    "metaData": {
      "author": "Author name if available",
      "views": "Number of views if available",
      "other": "Any other relevant data found"
    }
  }
]

Important rules:
- Always return exactly 5 news items.
- Fields inside "metaData" are optional, but include them if information is found.
- Do NOT wrap the JSON in code fences (no \`\`\`json).
- Do NOT include any text before or after the JSON.
- Ensure the JSON is valid and properly formatted.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    // Texto bruto vindo do Gemini
    const rawText = response.text();

    // Remove possíveis blocos de código e lixo extra
    const cleanText = cleanJsonString(rawText);

    // Converte para objeto
    let newsData;
    try {
      newsData = JSON.parse(cleanText);
    } catch (error) {
      console.error("Erro ao parsear JSON da IA:", error);
    }

    console.log(`\n======= NOTÍCIAS DE ${category.toUpperCase()} =======`);
    console.log({newsData});
    console.log("==========================================\n");

    return newsData;
  } catch (error) {
    console.error(`Erro ao obter notícias da categoria ${category}:`, error);
    return `Não foi possível obter as notícias da categoria ${category}.`;
  }
}

export async function getFutureTimelineByCategory(category) {
  try {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const prompt = `
Hoje é ${formattedDate}.
Com base no contexto atual do mundo, tendências políticas, econômicas, científicas e sociais, 
e considerando o calendário global de eventos da categoria "${category}", 
crie uma previsão narrativa dos próximos 12 meses. Quero que suponha , exemplo:

Noticia: Zelensky ganha apoio da UE e da Otan ao buscar lugar à mesa com Trump e Putin
Oque pode acontecer: Zelensky ganhará força nos proximos meses e poderá desafiar as tropas russas, oque irá gerar uma demanda maior de armamento afetando o mercado belico global.

Quero que para cada noticia , explore as consequencias no mercado global, oque irá gerar de novas oportunidades e como isso afeta o mundo

Lista de opções de globo:
- Basic
- Arc Links
- Highlight links
- Choropleth
- Elevated Polygons
- Hollow Globe
- Day Night Cycle
- Path Lines
- Heatmap
- Map Labels
- HTML Markers
- Hexed Country Polygons
- Tiles
- Ripple Rings
- Emit Arcs on Click
- Clouds
- Solar Terminator
- Tiled Map Engine
- Custom Globe Styling
- Custom Layer
- Glitch Post-Processing Effect
- World Population
- Population Heatmap
- Recent Earthquakes
- World Volcanoes
- Volcanoes Heatmap
- US outbound international airline routes
- Earth Shield
- Satellites
- Submarine Cables

Regras:
1. Analise a categoria e o conteúdo das notícias.
2. Escolha apenas **UMA** opção da lista que represente melhor o tema.

Formato de resposta:
Retorne todo texto em Inglês
Retorne SOMENTE um JSON válido, sem markdown, sem texto extra, contendo exatamente 10 eventos ordenados cronologicamente do mais próximo para o mais distante.
Cada evento deve conter:

precisa ser um retorno em json de um objeto com options e data

{
options: {
    ...option // irei desestruturar no meu <Globe {...options} para adequar o estilo as noticias
}
data: [
  {
    "order": "1", 
    "date": "YYYY-MM" ou "YYYY-MM-DD" (se possível estimar), 
    "title": "Título do evento previsto",
    "shortDescription": "Resumo curto",
    "description": "Descrição narrativa mais detalhada, como uma pequena história",
    "consequence": "Consequencia sobre o evento, oque o sujeito da noticia pode fazer posteriormente , como isso afeta o mundo , e quais oportunidades surgem",
    "categoryContext": "Breve explicação de como esse evento se relaciona com o contexto atual da categoria",
    "confidenceLevel": "Alto | Médio | Baixo",
    city: {
        coord: { lat, lng }
    }
  }
]
}

Regras:
- Use datas estimadas coerentes com o calendário real (ex.: eleições, reuniões de bancos centrais, conferências internacionais).
- Considere eventos políticos, financeiros ou científicos conforme a categoria.
- As descrições devem soar como uma pequena história, mas manter plausibilidade.
- Não invente datas de eventos que contradigam o calendário global real.
- Não incluir nenhum texto fora do JSON.


`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    const rawText = response.text();
    const cleanText = cleanJsonString(rawText);

    let timelineData;
    try {
      timelineData = JSON.parse(cleanText);
    } catch (error) {
      console.error("Erro ao parsear JSON de previsão:", error);
    }

    console.log(`\n======= PREVISÃO DE ${category.toUpperCase()} =======`);
    console.log({ timelineData });
    console.log("==========================================\n");

    return timelineData;
  } catch (error) {
    console.error(`Erro ao obter previsão da categoria ${category}:`, error);
    return `Não foi possível gerar a previsão para a categoria ${category}.`;
  }
}

