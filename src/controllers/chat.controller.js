const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const chatService = require('../services/chat.service');
const Chat = require('../models/chat.model');
const { matchFilter, sortAndLimit, formatData, calculateTotalResults } = require('../helper/functions');

const create = catchAsync(async (req, res) => {
  const data = req.body;
  data.from = req.user.id;
  const item = await chatService.create(data);

  // eslint-disable-next-line no-undef
  _io.to([data.from, data.to]).emit('message', { from: req.user.id, message: data.content });
  res.status(httpStatus.CREATED).send(item);
});

const query = catchAsync(async (req, res) => {
  const filter = matchFilter(req.user.id, req.query.to);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const limit = options.limit || 6;
  const page = options.page || 1;

  const aggregationPipeline = [
    {
      $match: filter,
    },
    {
      $sort: { createdAt: 1 },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        },
        content: { $push: '$$ROOT' },
      },
    },
    ...sortAndLimit(limit, page),
    {
      $project: {
        _id: 0,
        content: 1,
        date: {
          year: '$_id.year',
          month: '$_id.month',
          day: '$_id.day',
        },
      },
    },
    {
      $sort: { date: -1 },
    },
  ];

  const result = await Chat.aggregate(aggregationPipeline);
  const totalResults = calculateTotalResults(result);

  const paginatedResult = {
    results: await formatData(result),
    page: Number(page),
    limit: Number(limit),
    totalResults: calculateTotalResults(result),
    totalPages: Math.ceil(totalResults / Number(limit)),
  };
  res.status(httpStatus.OK).send(paginatedResult);
});

const getOne = catchAsync(async (req, res) => {
  const item = await chatService.getOne({ _id: req.params.id });
  if (!item) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
  }
  res.status(httpStatus.OK).send(item);
});

const updateOne = catchAsync(async (req, res) => {
  const card = await chatService.updateOne({ userId: req.user.id, _id: req.params.id }, req.body);
  res.status(httpStatus.OK).send(card);
});

const deleteOne = catchAsync(async (req, res) => {
  await chatService.deleteOne({ userId: req.user.id, _id: req.params.id });
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  create,
  query,
  getOne,
  updateOne,
  deleteOne,
};
