import supertest from 'supertest';

import app from "../src/app";
import { prisma } from "../src/database.js";

const agent = supertest(app);

beforeAll(async () => {
    await prisma.$executeRaw`DELETE FROM recommendations WHERE name = 'Falamansa - Xote dos Milagres'`;
});

describe("POST /recommendation", () => {
    it("given valid body, create recommendation", async () => {
        const response = await agent
            .post("/")
            .send({
                name: "Falamansa - Xote dos Milagres",
                youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
            })
        expect(response.status).toBe(200);
    });

    it("given invalid body, create recommendation", async () => {
        const response = await agent
            .post("/")
            .send({
                name: "",
                youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
            })
        expect(response.status).toBe(401);
    });

    it("given invalid body, create recommendation", async () => {
        const response = await agent
            .post("/")
            .send({
                name: "Falamansa - Xote dos Milagres",
                youtubeLink: "https://www.google.com/watch?v=chwyjJbcs1Y"
            })
        expect(response.status).toBe(401);
    });
});

describe("POST /recommendation:id/upvote", () => {
    it("given valid id, create recommendation", async () => {
        const response = await agent
            .post("/1/upvote");
        expect(response.status).toBe(200);
    });

    it("given invalid body, create recommendation", async () => {
        const response = await agent
            .post("/2/upvote");
        expect(response.status).toBe(404);
    });
});