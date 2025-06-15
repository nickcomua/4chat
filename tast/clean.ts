import models from "./models.json"

const cleanModels = models.data.map((model) => {
  return {
    id: model.id,
    name: model.name,
    // description: model.description,
  }
})

Bun.write("models_.json", JSON.stringify(cleanModels, null, 2))