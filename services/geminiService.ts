
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePropertyDescription = async (propertyData: any) => {
  try {
    const prompt = `
      Atue como um redator imobiliário experiente no mercado de Guaranésia e região sul de Minas Gerais. 
      Crie uma descrição persuasiva e profissional para um imóvel com as seguintes características:
      - Tipo: ${propertyData.type}
      - Finalidade: ${propertyData.dealType}
      - Quartos: ${propertyData.bedrooms}
      - Suítes: ${propertyData.suites}
      - Banheiros: ${propertyData.bathrooms}
      - Vagas: ${propertyData.parkingSpots}
      - Área: ${propertyData.areaTotal}m²
      - Localização: ${propertyData.address.neighborhood || 'Centro'}, Guaranésia, MG
      - Destaques: ${propertyData.description || 'Moderno, bem localizado'}

      A descrição deve ser otimizada para atrair potenciais clientes locais e investidores. 
      Use um tom acolhedor e profissional. Escreva exclusivamente em Português do Brasil.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Falha ao gerar descrição.";
  } catch (error) {
    console.error("Erro na API Gemini:", error);
    return "Erro ao processar descrição com IA.";
  }
};

export const analyzeFinancialHealth = async (transactions: any[]) => {
  try {
    const summary = transactions.map(t => {
      const type = t.type === 'INCOME' ? 'Entrada' : 'Saída';
      return `${t.date}: ${type} de R$${t.amount} - ${t.description}`;
    }).join('\n');

    const prompt = `
      Analise o fluxo de caixa abaixo de uma imobiliária em Guaranésia, MG e forneça um breve resumo executivo.
      Transações:
      ${summary}
      
      Responda de forma concisa e profissional em Português do Brasil.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    return "Não foi possível realizar a análise no momento.";
  }
};

export const getSmartValuation = async (propertyData: any) => {
  try {
    const prompt = `
      Atue como um avaliador de imóveis sênior com conhecimento do mercado imobiliário de Guaranésia, MG. 
      Com base nos dados abaixo, estime um valor sugerido para VENDA e um valor sugerido para LOCAÇÃO MENSAL.
      
      Dados do Imóvel:
      - Localização: ${propertyData.neighborhood || 'Centro'}, Guaranésia, MG
      - Área Útil: ${propertyData.area}m²
      - Quartos: ${propertyData.beds}
      - Suítes: ${propertyData.suites || 0}
      - Vagas: ${propertyData.parking}
      
      Forneça a resposta em um formato JSON simples: { "venda": string, "locacao": string, "justificativa": string }.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    return JSON.parse(response.text);
  } catch (error) {
    return { venda: "N/A", locacao: "N/A", justificativa: "Erro ao processar avaliação." };
  }
};
