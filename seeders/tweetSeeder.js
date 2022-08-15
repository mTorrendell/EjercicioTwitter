const { faker } = require("@faker-js/faker");
const Tweet = require("../models/Tweet");
const User = require("../models/User");

module.exports = async () => {
  const allUsersDb = await User.find();

  //va a crear 20 tweets
  for (let i = 0; i < 20; i++) {
    const randomNumber = faker.datatype.number({ min: 0, max: 9 });

    //crear Tweet con su info correspondiente
    const tweetCreado = await Tweet.create({
      content: faker.lorem.sentence(5),
      author: allUsersDb[randomNumber]._id,
      date: faker.date.recent(),
      likes: [],
    });

    //agregar tweet a su correspondiente user
    await searchUserandAddTweet(tweetCreado);
  }

  //update list of likes of each Tweet
  agregarLike(allUsersDb);
};

//--------------------------------------
async function searchUserandAddTweet(newTweet) {
  await User.updateOne({ _id: newTweet.author }, { $push: { tweetlist: newTweet._id } });
}

//---------------agregar random number de likes al array de likes en model Tweet-----------------------
async function agregarLike(listUsers) {
  const allTweets = await Tweet.find();
  for (const tweet of allTweets) {
    const likes = [];
    const randomNumberLikes = faker.datatype.number({ min: 1, max: listUsers.length });
    for (let j = 0; j < randomNumberLikes; j++) {
      likes.push(listUsers[j]._id);
    }

    await Tweet.updateOne({ _id: tweet._id }, { $push: { likes: likes } });
  }
}
