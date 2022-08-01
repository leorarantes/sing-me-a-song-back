import { jest } from "@jest/globals";

import { CreateRecommendationData, recommendationService } from "../../src/services/recommendationsService.js";
import recommendationRepository from "../../src/repositories/recommendationRepository.js";

jest.mock("../../src/repositories/recommendationRepository.js");

const recommendation: CreateRecommendationData = {
    name: "Falamansa - Xote dos Milagres",
    youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y"
}

describe("recommendationService test suite", () => {
    it("should create recommendation", async () => {
        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce((): any => { });
        jest.spyOn(recommendationRepository, "create").mockImplementationOnce((): any => { });

        await recommendationService.insert(recommendation);
        expect(recommendationRepository.findByName).toBeCalled();
    });

    it("should not create duplicated recommendation", async () => {
        jest.spyOn(recommendationRepository, "findByName").mockImplementationOnce((): any => recommendation);

        const promise = await recommendationService.insert(recommendation);
        expect(promise).rejects.toEqual({ message: "Recommendations names must be unique", type: "conflict" });
    });
});