import { Prisma } from "@prisma/client";
import { prisma } from "../database.js";
import { CreateRecommendationData } from "../services/recommendationsService.js";

async function create(createRecommendationData: CreateRecommendationData) {
  await prisma.recommendations.create({
    data: createRecommendationData,
  });
}

interface FindAllWhere {
  score: number;
  scoreFilter: "lte" | "gt";
}

function findAll(findAllWhere?: FindAllWhere) {
  const filter = getFindAllFilter(findAllWhere);

  return prisma.recommendations.findMany({
    where: filter,
    orderBy: { id: "desc" },
    take: 10
  });
}

function getAmountByScore(take: number) {
  return prisma.recommendations.findMany({
    orderBy: { score: "desc" },
    take,
  });
}

function getFindAllFilter(
  findAllWhere?: FindAllWhere
): Prisma.RecommendationsWhereInput {
  if (!findAllWhere) return {};

  const { score, scoreFilter } = findAllWhere;

  return {
    score: { [scoreFilter]: score },
  };
}

function find(id: number) {
  return prisma.recommendations.findUnique({
    where: { id },
  });
}

function findByName(name: string) {
  return prisma.recommendations.findUnique({
    where: { name },
  });
}

async function updateScore(id: number, operation: "increment" | "decrement") {
  return prisma.recommendations.update({
    where: { id },
    data: {
      score: { [operation]: 1 }
    }
  });
}

async function remove(id: number) {
  await prisma.recommendations.delete({
    where: { id },
  });
}

async function findAllNoFilter() {
  const recommendations = await prisma.recommendations.findMany();
  return recommendations;
}

export default {
  create,
  findAll,
  find,
  findByName,
  updateScore,
  getAmountByScore,
  remove,
  findAllNoFilter
};
