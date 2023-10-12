const ejs = require('ejs');
const fs = require('fs');
const juice = require('juice');
const mongoose = require('mongoose');

const createHTMLTemplate = async (templatePath, templateVars) => {
  // eslint-disable-next-line security/detect-non-literal-fs-filename
  const template = fs.readFileSync(templatePath, 'utf-8');
  const html = ejs.render(template, templateVars);
  const htmlActivation = juice(html);
  return htmlActivation;
};

const convertToSlug = async (text) => {
  return text
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');
};

const getCurrentDate = async () => {
  return new Promise((resolve) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    resolve(formattedDate);
  });
};

const getDayOfWeek = async (year, month, day) => {
  const daysOfWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  const date = new Date(year, month - 1, day);
  const dayOfWeekIndex = date.getDay();
  return daysOfWeek[dayOfWeekIndex];
};

const matchFilter = (userId, queryTo) => {
  return {
    $or: [
      { from: mongoose.Types.ObjectId(userId), to: mongoose.Types.ObjectId(queryTo) },
      { from: mongoose.Types.ObjectId(queryTo), to: mongoose.Types.ObjectId(userId) },
    ],
  };
};

const sortAndLimit = (limit, page) => {
  const skip = (page - 1) * limit;

  return [
    {
      $skip: skip,
    },
    {
      $limit: Number(limit),
    },
  ];
};

const formatData = async (result) => {
  // eslint-disable-next-line no-return-await
  return await Promise.all(
    result.map(async (item) => {
      const { day } = item.date;
      const { month } = item.date;
      const dayOfWeek = await getDayOfWeek(item.date.year, month, day);
      return {
        date: `${dayOfWeek}, ${day}/${month}`,
        content: item.content,
      };
    })
  );
};

const calculateTotalResults = (result) => {
  return result.reduce((total, dayResult) => total + dayResult.content.length, 0);
};

module.exports = {
  createHTMLTemplate,
  convertToSlug,
  getCurrentDate,
  getDayOfWeek,
  matchFilter,
  sortAndLimit,
  formatData,
  calculateTotalResults,
};
