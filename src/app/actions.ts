"use server";

import { getTrendingArticleSummary } from "@/ai/flows/trending-article-summary";

export async function generateTrendingSummary(articleTitle: string, articleContent: string) {
    try {
        const summary = await getTrendingArticleSummary({
            articleTitle,
            articleContent
        });
        return summary;
    } catch (error) {
        console.error("Error generating summary:", error);
        return null;
    }
}
