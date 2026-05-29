import responses from "../data/responses.json";

export function generateResponse(intent) {
  const intentResponses = responses[intent] || responses["general"];
  const randomIndex = Math.floor(Math.random() * intentResponses.length);
  return intentResponses[randomIndex];
}