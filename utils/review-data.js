// Imports
const Review = require("../models/review-schema");



// Constants
const uploadedImageSizeLimit = 1024 * 1024 * 5; // 5MB
const compressedImageSizeLimit = 1024 * 400; // 400KB
const allowedImageExtensions = ["png", "jpg", "jpeg", "gif", "webp"];



// Reviews
const review_array = [
  { name: "Angelica R", rating: 10, isUserSubmitted: false, hasImg: true, review: "This portable blender is AMAZING. I'm a working lady who used to always rushing to work without having breakfast, but now I can whip up my breakfast shakes in no time.", img: "/image/review/rev-img-1.jpg" },
  { name: "Mather", rating: 10, isUserSubmitted: false, hasImg: true, review: "It's amazing! Really pretty 🥰", img: "/image/review/rev-img-2.jpg" },
  { name: "Maria L", rating: 10, isUserSubmitted: false, hasImg: true, review: "Highly recommend this to anyone who is too busy to eat healthier. Very easy to clean as well. I dish wash it every day. Absolutely love this.", img: "/image/review/rev-img-3.jpg" },
  { name: "Gina", rating: 10, isUserSubmitted: false, hasImg: true, review: "I bought 2, one for me and one for my husband. We are both in love!! Use it multiple times a day. Love that I can drink straight from the blender and that I don't have to dirty another dish.", img: "/image/review/rev-img-4.jpg" },
  { name: "Stephany", rating: 10, isUserSubmitted: false, hasImg: true, review: "Love this product! It is very versatile. I use it to make smoothies, Frappuccino, juices, and salad dressings. It crushes ice with ease and I love the convenience of being able to take it on the go (picnic, work, airport, sporting events, etc).", img: "/image/review/rev-img-5.jpg" },
  { name: "Tina", rating: 10, isUserSubmitted: false, hasImg: true, review: "I love it!  No longer need to haul out the big old machine for just a small smoothie drink!  Try it yourself!", img: "/image/review/rev-img-6.jpg" },
  { name: "Jeffrey H", rating: 10, isUserSubmitted: false, hasImg: true, review: "The best surprise I could have gotten the wife she loves it.", img: "/image/review/rev-img-7.jpg" },
  { name: "Kiaraa", rating: 10, isUserSubmitted: false, hasImg: true, review: "I’m obsessed with my new blender! I hate the smell protien shakes leave in my tradition protein shaker bottle, so I decided to upgrade since fresh juice has self cleaning. Proud to say I haven't used my protien shaker bottle since. This is so much better!", img: "/image/review/rev-img-8.jpg" },
  { name: "Renee", rating: 10, isUserSubmitted: false, hasImg: true, review: "I'm a frequent traveler who wants to stay healthy. I bought Fresh Juice and was blown away by the benefits. Perfect for camping and hiking. So no more health compromises, and I strongly recommend everyone to buy this.", img: "/image/review/rev-img-9.jpg" },
  { name: "Danielle", rating: 10, isUserSubmitted: false, hasImg: true, review: "I was fed up with my previous blenders as they were a mess and noisy. One of my friends bought Fresh Juice and recommended me.", img: "/image/review/rev-img-10.jpg" },
  { name: "Saane A", rating: 10, isUserSubmitted: false, hasImg: true, review: "So excited I treated myself! Having a great fresh morning smoothie is such a treat especially when heading to work a 12hr shift", img: "/image/review/rev-img-11.jpg" },
  { name: "Jen", rating: 10, isUserSubmitted: false, hasImg: true, review: "Arrived in 8 days", img: "/image/review/rev-img-12.jpg" },
  { name: "Lolawesome", rating: 10, isUserSubmitted: false, hasImg: true, review: "I like banana smoothies", img: "/image/review/rev-img-13.jpg" },
  { name: "Ashley", rating: 10, isUserSubmitted: false, hasImg: true, review: "LoveIt ❤", img: "/image/review/rev-img-14.jpg" },
  { name: "Joy O", rating: 10, isUserSubmitted: false, hasImg: true, review: "Amazing blender, i wish i bought it earlier", img: "/image/review/rev-img-15.jpg" },
  { name: "Denise", rating: 10, isUserSubmitted: false, hasImg: true, review: "So easy to use!", img: "/image/review/rev-img-16.jpg" },
  { name: "Nighel", rating: 10, isUserSubmitted: false, hasImg: true, review: "Color is soo good, just like in the picture! It works very well!", img: "/image/review/rev-img-17.jpg" },
  { name: "Shopper", rating: 10, isUserSubmitted: false, hasImg: true, review: "I loved it a lot, besides beautiful super useful", img: "/image/review/rev-img-18.jpg" },
  { name: "Shopper", rating: 10, isUserSubmitted: false, hasImg: true, review: "The juicer is very easy to clean, got a brush gift and the juice tastes great. It is multi-filtered, which is suitable for the separation of pomace.", img: "/image/review/rev-img-19.jpg" },
  { name: "Alex", rating: 10, isUserSubmitted: false, hasImg: true, review: "Love it!!! Where was this before?", img: "/image/review/rev-img-20.jpg" },
  { name: "Zoey", rating: 10, isUserSubmitted: false, hasImg: true, review: "Awesome!! The baby has been clamoring for a juice machine for a long time", img: "/image/review/rev-img-21.jpg" },
  { name: "Gerak", rating: 10, isUserSubmitted: false, hasImg: true, review: "This juicer is particularly easy to use. The juice extracted is very good, and the slag juice is very clearly separated. And it's not wasted at all.", img: "/image/review/rev-img-22.jpg" },
  { name: "Shopper", rating: 10, isUserSubmitted: false, hasImg: true, review: "taste is very good! It is also very convenient to clean after use, and rinsing with water makes it clean.", img: "/image/review/rev-img-23.jpg" },
  { name: "Ahmad", rating: 10, isUserSubmitted: false, hasImg: true, review: "Beautiful, super easy and fast, and everything is mixed.", img: "/image/review/rev-img-24.jpg" },
  { name: "Shopper", rating: 10, isUserSubmitted: false, hasImg: true, review: "Perfect ❤️", img: "/image/review/rev-img-25.jpg" },
  { name: "Henrik Skogbakken", rating: 10, isUserSubmitted: false, hasImg: true, review: "Works perfectly, easy to carry and just amazing", img: "/image/review/rev-img-26.jpg" },
  { name: "Clara", rating: 10, isUserSubmitted: false, hasImg: true, review: "just received, and it is just amazing how easy it is to carry anywehere", img: "/image/review/rev-img-27.jpg" },
  { name: "Melvin Casper", rating: 10, isUserSubmitted: false, hasImg: true, review: "Came in as exactly as shown.", img: "/image/review/rev-img-28.jpg" },
  { name: "Olli", rating: 10, isUserSubmitted: false, hasImg: true, review: "The Juicer is unrealistically cool, and it is really easy to clean", img: "/image/review/rev-img-29.jpg" },
  { name: "Kevin H", rating: 10, isUserSubmitted: false, hasImg: true, review: "I used it today. Very satisfied with the quality, delivery and convenience of washing.", img: "/image/review/rev-img-30.jpg" },
  { name: "Melissa", rating: 10, isUserSubmitted: false, hasImg: true, review: "Good! I order a second time.", img: "/image/review/rev-img-31.png" },
  { name: "Dave", rating: 10, isUserSubmitted: false, hasImg: true, review: "Very good product, it came very fast, which blew me away. So far the effect is very good, the juice is very delicate, it only takes ten seconds to complete a cup of juice", img: "/image/review/rev-img-32.jpg" },
  { name: "Bep :)", rating: 10, isUserSubmitted: false, hasImg: true, review: "I love it too much is very good and simple to use very comfortable quick for fruits important for traveling and every other things", img: "/image/review/rev-img-33.jpg" },
  { name: "Casey", rating: 10, isUserSubmitted: false, hasImg: true, review: "I use every day, the engine copes with all vegetables and fruits Excellent juicer.", img: "/image/review/rev-img-34.jpg" },
  { name: "Shopper", rating: 10, isUserSubmitted: false, hasImg: true, review: "My wife is very pleased. I'm very surprised that with such a low power this device gives so much good result.", img: "/image/review/rev-img-35.jpg" },
  { name: "Alli", rating: 10, isUserSubmitted: false, hasImg: true, review: "Excellent product! I am very satisfied, it is of excellent quality and very powerful.", img: "/image/review/rev-img-36.jpg" },
  { name: "Shopper", rating: 10, isUserSubmitted: false, hasImg: true, review: "wonderful! beautiful and works perfectly!", img: "/image/review/rev-img-37.jpg" },
  { name: "Yanna", rating: 10, isUserSubmitted: false, hasImg: true, review: "fast delivery, same as picture, I recommend this seller", img: "/image/review/rev-img-38.jpg" },
  { name: "Chrissy <3", rating: 10, isUserSubmitted: false, hasImg: true, review: "Very nice, makes the smoothie fast, doesn't spill even if it turns and doesn't make too much noise, it's cute. I love it.", img: "/image/review/rev-img-39.jpg" },
  { name: "Supermom", rating: 10, isUserSubmitted: false, hasImg: true, review: "Strong motor, convenient to use and wash. Wireless charging. My child loves it", img: "/image/review/rev-img-40.jpg" },
  { name: "Shopper", rating: 10, isUserSubmitted: false, hasImg: true, review: "Good", img: "/image/review/rev-img-41.jpg" },
  { name: "Lucy", rating: 10, isUserSubmitted: false, hasImg: true, review: "Good blender. well packed, without defects. For the sample mixed kiwi with water, was charged and resented in a couple of seconds. Recommend.", img: "/image/review/rev-img-42.jpg" },
  { name: "Adam Nielen", rating: 10, isUserSubmitted: false, hasImg: true, review: "The mixer cuts powerful and fast", img: "/image/review/rev-img-43.jpg" },
  { name: "Sam", rating: 10, isUserSubmitted: false, hasImg: true, review: "Wow .. i’m so impressed. The quality and the blender itself is really good and they is so stable. Woooww .. Can I give more than 5 stars", img: "/image/review/rev-img-44.webp" },
  { name: "Reni", rating: 10, isUserSubmitted: false, hasImg: true, review: "Having a great fresh morning smoothie is such a treat especially when heading to work a 12hr shift", img: "/image/review/rev-img-45.jpg" },
  { name: "Pattie Hart", rating: 9, isUserSubmitted: false, hasImg: true, review: "Convenient to use and wash.", img: "/image/review/rev-img-46.webp" },
  { name: "Olaivavega", rating: 10, isUserSubmitted: false, hasImg: false, review: "This little thing got some power!", img: "" },
  { name: "Alan H", rating: 10, isUserSubmitted: false, hasImg: false, review: "Pretty good and great price.", img: "" },
  { name: "Brittany", rating: 10, isUserSubmitted: false, hasImg: false, review: "Oh so easy,,,,,, so far i've made soup, smoothies, tomato juice and frozen Berry shakes. Still looking to do lots more new stuff.", img: "" },
  { name: "TaKirrya", rating: 10, isUserSubmitted: false, hasImg: false, review: "You need to first put your hands on this blender to experience it well we’ll. It just does what it’s supposed to do 👌🏾", img: "" },
  { name: "Lexy", rating: 10, isUserSubmitted: false, hasImg: false, review: "It's so nice to use on the go!", img: "" },
  { name: "Lidia", rating: 10, isUserSubmitted: false, hasImg: false, review: "bought 4 for Christmas presents because I love making protein and smoothie shakes throughout the day", img: "" },
  { name: "Emerson", rating: 10, isUserSubmitted: false, hasImg: false, review: "Love It!! Quick and easy!", img: "" },
  { name: "Adrianna B", rating: 10, isUserSubmitted: false, hasImg: false, review: "It works great. It blended my fruit perfectly", img: "" },
  { name: "Shopper", rating: 10, isUserSubmitted: false, hasImg: false, review: "Arrived so fast. And it works like advertised!", img: "" },
  { name: "Mary", rating: 10, isUserSubmitted: false, hasImg: false, review: "Beautiful color and super convenient!", img: "" },
  { name: "Rachel", rating: 10, isUserSubmitted: false, hasImg: false, review: "👍🏼", img: "" },
  { name: "Jeffrey", rating: 10, isUserSubmitted: false, hasImg: false, review: "High quality, better than expected, recommend to the world, nicely packaged, foremost perfect!", img: "" },
  { name: "Hanson", rating: 9, isUserSubmitted: false, hasImg: false, review: "Works just the way it’s supposed to", img: "" },
  { name: "Nicholas", rating: 9, isUserSubmitted: false, hasImg: false, review: "Works great. Seems well made", img: "" },
  { name: "Sam", rating: 9, isUserSubmitted: false, hasImg: false, review: "It meets my expectations. I am very delighted. An excellent portable blender! I'm so happy I got it.", img: "" },
  { name: "Adrian", rating: 9, isUserSubmitted: false, hasImg: false, review: "Very useful", img: "" },
  { name: "Shira", rating: 9, isUserSubmitted: false, hasImg: false, review: "Delivered earlier than expected. It is great. Thank you!", img: "" },
  { name: "Shopper", rating: 8, isUserSubmitted: false, hasImg: false, review: "Awesome", img: "" },
  { name: "Vincente", rating: 8, isUserSubmitted: false, hasImg: false, review: "Excellent Product, comfortable, easy to use.", img: "" },
  { name: "Terry", rating: 8, isUserSubmitted: false, hasImg: false, review: "Excellent I love it! Thank you very much. Arrived in London in 1,5 weeks.", img: "" },
  { name: "Shopper", rating: 7, isUserSubmitted: false, hasImg: false, review: "Worth buying.", img: "" },
];



// Combine the review_array with the reviews from the database and sort them by rating
async function getReviewArray() {
  const review_arr = JSON.parse(JSON.stringify(review_array));
  const reviews = await Review.find({ isShown: true });
  if (reviews.length != 0) {
    reviews.forEach((review) => {
      review_arr.push({
        name: review.name,
        rating: review.rating,
        isUserSubmitted: true,
        hasImg: review.hasImg,
        img: (review.hasImg) ? review.img : "",
        review: review.review,
      });
    });
    review_arr.sort((a, b) => {
      if (a.rating > b.rating) return -1;
      if (a.rating > b.rating) return 1;
      if (a.rating == b.rating) {
        if (!a.isUserSubmitted && b.isUserSubmitted) return -1;
        if (a.isUserSubmitted && !b.isUserSubmitted) return 1;
        return 0;
      }
    });
  }
  return review_arr;
}



// Get the review analytics from the reviews
async function getReviewData() {
  const review_arr = JSON.parse(JSON.stringify(review_array));
  const reviews = await Review.find({ isShown: true });
  if (reviews != 0) {
    reviews.forEach((review) => {
      review_arr.push({
        name: review.name,
        rating: review.rating,
        isUserSubmitted: true,
        hasImg: review.hasImg,
      });
    });
  }
  const review_data = {
    total_reviews: review_arr.length,
    total_5_stars: 0,
    total_4_stars: 0,
    total_3_stars: 0,
    total_2_stars: 0,
    total_1_stars: 0,
    average_stars: 0,
    average_stars_svg: 0,
  }
  review_arr.forEach((rev) => {
    if (rev.rating == 10 || rev.rating == 9) { review_data.total_5_stars += 1; }
    else if (rev.rating == 8 || rev.rating == 7) { review_data.total_4_stars += 1; }
    else if (rev.rating == 6 || rev.rating == 5) { review_data.total_3_stars += 1; }
    else if (rev.rating == 4 || rev.rating == 3) { review_data.total_2_stars += 1; }
    else if (rev.rating == 2 || rev.rating == 1) { review_data.total_1_stars += 1; }
    review_data.average_stars += rev.rating;
  });
  review_data.average_stars = Math.round(((review_data.average_stars / review_data.total_reviews) / 2 + Number.EPSILON) * 10) / 10;
  review_data.average_stars_svg = Math.floor(review_data.average_stars * 2);
  return review_data;
}



// Exports
module.exports = { 
  uploadedImageSizeLimit,
  compressedImageSizeLimit,
  allowedImageExtensions,
  getReviewArray,
  getReviewData,
}