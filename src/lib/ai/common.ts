import { AiResponse } from "@effect/ai"


const mergeParts = (self: AiResponse.AiResponse, other: AiResponse.AiResponse): ReadonlyArray<AiResponse.Part> => {
    if (other.parts.length === 0) {
        return self.parts
    }
    if (self.parts.length === 0) {
        return other.parts
    }
    const lastPart = self.parts[self.parts.length - 1]
    const newParts: Array<AiResponse.Part> = []
    const otherPartsRest: Array<AiResponse.Part> = []
    let text = lastPart._tag === "TextPart" ? lastPart.text : ""
    for (const part of other.parts) {
        if (part._tag === "TextPart") {
            text += part.text
        } else {
            otherPartsRest.push(part)
        }
    }
    if (text.length > 0) {
        newParts.push(new AiResponse.TextPart({ text }, {
            disableValidation: true
        }))
    }
    return newParts.length === 0 ? self.parts : [...self.parts.slice(0, self.parts.length - 1), ...otherPartsRest, ...newParts]
}

export const mergeAiResponse = (aiResponseA: AiResponse.AiResponse, aiResponseB: AiResponse.AiResponse) => {
    const parts = mergeParts(aiResponseA, aiResponseB)
    return AiResponse.AiResponse.make({
        parts
    }, {
        disableValidation: true
    })
}