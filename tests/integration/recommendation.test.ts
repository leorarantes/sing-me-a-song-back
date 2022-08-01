import supertest from 'supertest';

import app from "../../src/app";
import { prisma } from "../../src/database.js";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { recommendationEntireSchema } from "../../src/schemas/recommendationsSchemas.js";
import { getLastRecommendationId } from "../factories/recommendationFactory.js";

const agent = supertest(app);

beforeAll(async () => {
    await prisma.$executeRaw`DELETE FROM recommendations WHERE name = 'Falamansa - Xote dos Milagres'`;
});

describe("POST /recommendations", () => {
    it("given valid body, create recommendation", async () => {
        const response = await agent
            .post("/recommendations")
            .send({
                name: "Falamansa - Xote dos Milagres",
                youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
            })
        expect(response.status).toBe(201);
    });

    it("given invalid body, fail to create recommendation", async () => {
        const response = await agent
            .post("/recommendations")
            .send(undefined)
        expect(response.status).toBe(422);
    });

    it("given invalid body, fail to create recommendation", async () => {
        const response = await agent
            .post("/recommendations")
            .send({
                name: "Falamansa - Xote dos Milagres",
                youtubeLink: "https://www.google.com/watch?v=chwyjJbcs1Y"
            })
        expect(response.status).toBe(422);
    });
});

describe("GET /recommendations", () => {
    it("get recommendations", async () => {
        await recommendationRepository.create({
            name: "Chitãozinho E Xororó - Evidências",
            youtubeLink: "https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO"
        });
        const response = await agent.get(`/recommendations`);
        const validation = recommendationEntireSchema.validate(response.body[0]);
        expect(validation.error).toBe(undefined);
    });
});

describe("GET /recommendations/top/:amount", () => {
    it("get top recommendations", async () => {
        const validAmount = (Math.random() * 10).toFixed(0);
        const response = await agent.get(`/recommendations/top/${validAmount}`);
        const validation = recommendationEntireSchema.validate(response.body[0]);
        expect(validation.error).toBe(undefined);
    });
});

describe("GET /recommendations/:id", () => {
    it("given valid id, get recommendation", async () => {
        const validId = await getLastRecommendationId();
        const response = await agent.get(`/recommendations/${validId}`);
        const validation = recommendationEntireSchema.validate(response.body);
        expect(validation.error).toBe(undefined);
    });

    it("given invalid id, fail to get recommendation", async () => {
        const invalidId = await getLastRecommendationId() + 1;
        const response = await agent.get(`/recommendations/${invalidId}`);
        expect(response.status).toBe(404);
    });
});

describe("POST /recommendations/:id/upvote", () => {
    it("given valid id, upvote", async () => {
        const validId = await getLastRecommendationId();
        const response = await agent.post(`/recommendations/${validId}/upvote`);
        expect(response.status).toBe(200);
    });

    it("given invalid id, fail to upvote", async () => {
        const invalidId = await getLastRecommendationId() + 1;
        const response = await agent.post(`/recommendations/${invalidId}/upvote`);
        expect(response.status).toBe(404);
    });
});

describe("POST /recommendations/:id/downvote", () => {
    it("given valid id, downvote", async () => {
        const validId = await getLastRecommendationId();
        const response = await agent.post(`/recommendations/${validId}/downvote`);
        expect(response.status).toBe(200);
    });

    it("given invalid id, fail to downvote", async () => {
        const invalidId = await getLastRecommendationId() + 1;
        const response = await agent.post(`/recommendations/${invalidId}/downvote`);
        expect(response.status).toBe(404);
    });

    it("if score < -5, fail to downvote", async () => {
        const lastRecommendationId = await getLastRecommendationId();

        for(let i=0; i<6; i++) await recommendationRepository.updateScore(lastRecommendationId, "decrement");

        await agent.post(`/recommendations/${lastRecommendationId}/downvote`);

        const response = await agent.post(`/recommendations/${lastRecommendationId}/downvote`);
        expect(response.status).toBe(404);
    });
});

describe("GET /recommendations/random", () => {
    it("if any recommendations exists, get random recommendations", async () => {
        const response = await agent.get(`/recommendations/random`);
        const validation = recommendationEntireSchema.validate(response.body[0]);
        expect(validation.error).toBe(undefined);
    });

    it("if no recommendations exists, fail to get random recommendations", async () => {
        await prisma.$executeRaw`DELETE FROM recommendations WHERE name = 'Falamansa - Xote dos Milagres'`;
        const response = await agent.get(`/recommendations/random`);
        expect(response.status).toBe(404);
    });
});