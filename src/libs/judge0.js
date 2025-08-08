import axios from 'axios';

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;

const rapidApiHeaders = {
    'X-RapidAPI-Key': RAPIDAPI_KEY,
    'X-RapidAPI-Host': RAPIDAPI_HOST,
};

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getJudge0LanguageId = (language) => {
    const languageMap = {
        PYTHON: 71,
        JAVA: 62,
        JAVASCRIPT: 63,
        // 'C++': 54,
    };

    return languageMap[language.toUpperCase()];
};

export const getLanguageName = (languageId) => {
    const language_names = {
        71: 'Python',
        62: 'Java',
        63: 'Javascript',
        // 54: 'C++',
    };

    return language_names[languageId] || 'Unknown';
};

export const submitBatch = async (submissions) => {
    const { data } = await axios.post(
        `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
        {
            submissions,
        },
        { headers: rapidApiHeaders }
    );

    console.log('Submission Results: ', data);

    return data;
};

export const pollBatchResults = async (tokens) => {
    while (true) {
        const { data } = await axios.get(
            `${process.env.JUDGE0_API_URL}/submissions/batch`,
            {
                params: {
                    tokens: tokens.join(','),
                    base64_encoded: false,
                },
                headers: rapidApiHeaders,
            }
        );

        if (!data?.submissions || !Array.isArray(data.submissions)) {
            throw new Error("Judge0 batch response is missing 'submissions'");
        }

        const results = data.submissions;

        const isAllDone = results.every(
            (r) => r.status.id !== 1 && r.status.id !== 2
        );

        if (isAllDone) return results;

        await sleep(1000);
    }
};
