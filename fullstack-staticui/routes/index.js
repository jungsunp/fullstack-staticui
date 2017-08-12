const express = require('express');
const router = express.Router();
const { Activity, Hotel, Place, Restaurant} = require('../db/models');
const Promise = require('bluebird');

module.exports = router;

router.get('/', (req, res, next) => {
  let promiseActivity = Activity.findAll();
  let promiseHotel = Hotel.findAll();
  let promiseRestaurant = Restaurant.findAll();

  Promise.all([promiseActivity, promiseHotel, promiseRestaurant])
    .spread((activities, hotels, restaurants) => {

      // res.render(index)
      res.render('index', {
        activities,
        hotels,
        restaurants
      });
    })
    .catch(next);
});
