const emailCheck = function(newEmail, users) {
  for (let user in users) {
    if (users[user].email === newEmail) {
      return users[user];
    }
  }
  return undefined;
};

module.exports = {emailCheck};