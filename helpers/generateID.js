const generateID = (type) => {
  const char = type === 'login' ? 'L' : 'F';
  const random = Math.random().toString(32).substring(2);
  const date = Date.now().toString(32);

  return char + random + date;
};

module.exports = generateID;
