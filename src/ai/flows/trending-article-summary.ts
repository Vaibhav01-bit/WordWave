'use server';

/**
 * @fileOverview An AI agent that identifies and summarizes the trending article.
 *
 * - getTrendingArticleSummary - A function that returns the summary of the trending article.
 * - TrendingArticleSummaryInput - The input type for the getTrendingArticleSummary function.
 * - TrendingArticleSummaryOutput - The return type for the getTrendingArticleSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TrendingArticleSummaryInputSchema = z.object({
  articleTitle: z.string().describe('The title of the trending article.'),
  articleContent: z.string().describe('The content of the trending article.'),
});
export type TrendingArticleSummaryInput = z.infer<typeof TrendingArticleSummaryInputSchema>;

const TrendingArticleSummaryOutputSchema = z.object({
  articleSummary: z.string().describe('A short summary of the trending article.'),
});
export type TrendingArticleSummaryOutput = z.infer<typeof TrendingArticleSummaryOutputSchema>;

export async function getTrendingArticleSummary(input: TrendingArticleSummaryInput): Promise<TrendingArticleSummaryOutput> {
  return trendingArticleSummaryFlow(input);
}

const trendingArticleSummaryPrompt = ai.definePrompt({
  name: 'trendingArticleSummaryPrompt',
  input: {schema: TrendingArticleSummaryInputSchema},
  output: {schema: TrendingArticleSummaryOutputSchema},
  prompt: `You are an expert content summarizer.

You will receive the title and content of a trending article.
Your task is to provide a concise and engaging summary of the article that will entice users to read the full article.

Article Title: {{{articleTitle}}}
Article Content: {{{articleContent}}}

Summary:`,
});

const trendingArticleSummaryFlow = ai.defineFlow(
  {
    name: 'trendingArticleSummaryFlow',
    inputSchema: TrendingArticleSummaryInputSchema,
    outputSchema: TrendingArticleSummaryOutputSchema,
  },
  async input => {
    const {output} = await trendingArticleSummaryPrompt(input);
    return output!;
  }
);
