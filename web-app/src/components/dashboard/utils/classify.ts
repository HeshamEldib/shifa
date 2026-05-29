export default function classify(
  message: string,
  questions: any,
  metadata: any
): string {
  const intentMap = metadata.intent_map;

  for (let [intent, keywords] of Object.entries(intentMap)) {
    // قولي له إن keywords مصفوفة نصوص
    const words = keywords as string[];

    for (let kw of words) {
      if (message.includes(kw)) {
        return intent;
      }
    }
  }

  return "general";
}