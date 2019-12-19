// import local dependencies
import Router from './util/Router';
import common from './routes/common';

/** Populate Router instance with DOM routes */
const routes = new Router({
  common,
});

// Load Events
$(document).ready(() => routes.loadEvents());