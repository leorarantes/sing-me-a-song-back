import supertest from 'supertest';

import app from "../src/app";
import { prisma } from "../src/database.js";
import { recommendationRepository } from '../src/repositories/recommendationRepository.js';

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
            .send({
                name: "",
                youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
            })
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

describe("POST /recommendations/:id/upvote", () => {

    it("given valid id, upvote", async () => {
        const recommendations = await recommendationRepository.findAllNoFilter();
        const response = await agent
            .post(`/recommendations/${recommendations[recommendations.length-1].id}/upvote`);
        expect(response.status).toBe(200);
    });

    it("given invalid id, fail to upvote", async () => {
        const recommendations = await recommendationRepository.findAllNoFilter();
        const response = await agent
            .post(`/recommendations/${recommendations[recommendations.length-1].id+1}/upvote`);
        expect(response.status).toBe(404);
    });
});

afterAll(async () => {
    await prisma.$executeRaw`DELETE FROM recommendations WHERE name = 'Falamansa - Xote dos Milagres'`;
});