import { Recommendations } from "@prisma/client";
import joi from "joi";

import { CreateRecommendationData } from "../services/recommendationsService.js";

const youtubeLinkRegex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;

export const recommendationSchema = joi.object<CreateRecommendationData>({
  name: joi.string().required(),
  youtubeLink: joi.string().required().pattern(youtubeLinkRegex),
});

export const recommendationEntireSchema = joi.object<Recommendations>({
  id: joi.number().integer(),
  name: joi.string().required(),
  youtubeLink: joi.string().required().pattern(youtubeLinkRegex),
  score: joi.number().integer()
});