const { faker } = require("@faker-js/faker");
const User = require("../models/User");
const _ = require("lodash");

faker.locale = "es";
const listImages = [
  "https://upload.wikimedia.org/wikipedia/commons/7/74/Titanium_La_Portada_%2838888739395%29.jpg",
  "https://viajes.nationalgeographic.com.es/medio/2019/10/25/portada-20-aniversario_55796547_1280x720.jpg",
  "https://i.pinimg.com/originals/11/9f/aa/119faa53dbdcb9612609b3414b89c302.jpg",
];
module.exports = async () => {
  for (let i = 0; i < 10; i++) {
    const randomNumber = faker.datatype.number({ min: 0, max: 2 });
    await User.create({
      name: faker.name.firstName() + " " + faker.name.lastName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      password: "123",
      description: faker.lorem.sentence(2),
      profilepicture: faker.image.avatar(),
      backgroundpicture: listImages[randomNumber],
      listaTweets: [],
      followers: [],
      following: [],
    });
  }
  const allUsers = await User.find();

  await agregarFollowers(allUsers);
};

async function agregarFollowers(allUsers) {
  for (const user of allUsers) {
    const randomNumberOfUsers = faker.datatype.number({ min: 2, max: 9 });
    const withoutUser = _.filter(allUsers, function (item) {
      return item._id !== user._id;
    });
    const randomUsers = _.sampleSize(withoutUser, randomNumberOfUsers);
    for (let i = 0; i < randomNumberOfUsers; i++) {
      if (user._id !== randomUsers[i]._id) {
        await User.updateOne(
          { _id: user._id },
          { $push: { following: randomUsers[i]._id } }
        );
        await User.updateOne(
          { _id: randomUsers[i]._id },
          { $push: { followers: user._id } }
        );
      }
    }
  }
}
