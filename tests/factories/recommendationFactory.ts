import supertest from 'supertest';

import { prisma } from "../../src/database.js";
import app from "../../src/app.js";

const agent = supertest(app);

export async function getLastRecommendationId() {
    const recommendations = await prisma.recommendations.findMany();
    return recommendations[recommendations.length-1].id;
};