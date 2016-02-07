window.React = require('react');
var ReactDOM = require('react-dom');
var ReactRouter = require('react-router');
var createBrowserHistory = require('history/lib/createBrowserHistory');
//window.$ = window.jQuery = require('jquery');
require('bootstrap');

var Root = require('./components/root');
var Index = require('./components/index');
var Apps = require('./components/apps');
var App = require('./components/app');
var Me = require('./components/me');
var List = require('./components/list');
var Wishlist = require('./components/wishlist');
var Wish = require('./components/wish');
var AppRequest = require('./components/modals/appRequest');
var actions = require('./actions');

var h = createBrowserHistory({
  queryKey: false
});

h.listen(function(location) {
  actions.setLocation(location.pathname + location.search);

  window.jQuery('#main-menu').collapse('hide');

  if (window.jQuery.swipebox.isOpen) {
    window.jQuery.swipebox.close();
  }
});

window.jQuery('.swipebox').swipebox();

ReactDOM.render((
  <ReactRouter.Router history={h}>
    <ReactRouter.Route path="/" component={Root}>
      <ReactRouter.IndexRoute component={Index} />
      <ReactRouter.Route path="/apps" component={Apps} />
      <ReactRouter.Route path="/apps/request" component={AppRequest} />
      <ReactRouter.Route path="/app/:name" component={App} />
      <ReactRouter.Route path="/me" component={Me} />
      <ReactRouter.Route path="/list/:id" component={List} />
      <ReactRouter.Route path="/wishlist" component={Wishlist} />
      <ReactRouter.Route path="/wishlist/:id" component={Wish} />
    </ReactRouter.Route>
  </ReactRouter.Router>
), document.getElementById('main'));