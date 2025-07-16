import axios from 'axios';

const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getJudge0LanguageId = (language) => {
    const languageMap = {
        PYTHON: 71,
        JAVA: 62,
        JAVASCRIPT: 63,
        PYTHON: 71,
        'C++': 54,
    };

    return languageMap[language.toUpperCase()];
};

export const submitBatch = async (submissons) => {
    const { data } = axios.post(
        `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
        {
            submissons,
        }
    );

    console.log('Submission Results: ', data);

    return data;
};

export const pollBatchResults = async (tokens) => {
    while (true) {
        const { data } = await axios.get(
            `${process.env.JUDGE0_API_URL}/submissions/batch`,
            {
                params: tokens.join(','),
                base64_encoded: false,
            }
        );

        const results = data.submissons;

        const isAllDone = results.every(
            (result) => result.status.id !== 1 && result.status.id !== 2
        );

        if (isAllDone) return results;

        await sleep(1000);
    }
};
