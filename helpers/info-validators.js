const emailValidator = (email = '') => {
  if (email.length && !email.includes('@thevinecentre.org.uk')) {
    throw new Error(`${email} is not valid`);
  }
};

const passwordValidator = (password) => {
  const regexStrong = new RegExp(
    '^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{8,}$'
  );

  if (password && !regexStrong.test(password)) {
    throw new Error('Is very week password');
  }
};

module.exports = {
  emailValidator,
  passwordValidator,
};
