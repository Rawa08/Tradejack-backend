const clientRoutes = require('./users/client');
const contractorRoutes = require('./users/contractor');
const workOrderRoutes = require('./workOrders/workOrder');
const workOfferRoutes = require('./workOffers/workOffers');

module.exports = {
    clientRoutes,
    contractorRoutes,
    workOrderRoutes,
    workOfferRoutes
}