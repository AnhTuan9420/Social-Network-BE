// eslint-disable-next-line import/no-extraneous-dependencies
const OpenAI = require('openai');

const httpStatus = require('http-status');
const { openai, config } = require('../config/openai');
const ApiError = require('../utils/ApiError');
const moduleService = require('./module.service');

const sendRequest = async (dataRequest, isStream = false) => {
  try {
    const requestData = config;
    requestData.messages = dataRequest;
    requestData.stream = false;

    if (isStream) {
      requestData.stream = true;
    }

    const completion = await openai.chat.completions.create(requestData);
    return completion;
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      throw new ApiError(error.status, error.message);
    } else {
      throw new ApiError(httpStatus.BAD_REQUEST, 'sendRequest function has an error');
    }
  }
};

const getAndStreamResponse = async (res, dataRequest, journalId) => {
  let finalMessage = '';
  const completion = await sendRequest(dataRequest, true);

  // eslint-disable-next-line no-restricted-syntax
  for await (const part of completion) {
    try {
      const content = part.choices[0].delta.content || '';
      const finishReason = part.choices[0].finish_reason;

      if (finishReason !== 'stop') {
        // eslint-disable-next-line no-unused-vars
        finalMessage += content;
        res.write(content);
      } else {
        await moduleService.updateOne({ _id: journalId }, { message: finalMessage, isRequestToOpenAi: true });
        res.end();
      }
    } catch (e) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'getAndStreamResponse function has an error');
    }
  }
};

module.exports = {
  sendRequest,
  getAndStreamResponse,
};
