// eslint-disable-next-line import/no-extraneous-dependencies
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
});

const config = {
  model: 'gpt-3.5-turbo',
  temperature: 0.2,
  top_p: 0.75,
  n: 1,
  stop: null,
  max_tokens: 2000,
  presence_penalty: 0.5,
  frequency_penalty: 0.5,
};

module.exports = {
  openai,
  config,
};
