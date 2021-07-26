const clientRoutes = require('./users/client');
const contractorRoutes = require('./users/contractor');
const workOrderRoutes = require('./workOrders/workOrder');
const workOfferRoutes = require('./workOffers/workOffers');
const contractorRating = require('./workOffers/rating');

module.exports = {
    clientRoutes,
    contractorRoutes,
    workOrderRoutes,
    workOfferRoutes,
    contractorRating
}