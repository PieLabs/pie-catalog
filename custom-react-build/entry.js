//This is a custom build of react with the tap event plugin. This is needed while alot of components make use of material-ui.

window.React = require('react');
window.React.addons = React.addons || {};
window.React.addons.TransitionGroup = require('react-addons-transition-group');
window.React.addons.CSSTransitionGroup = require('react-addons-css-transition-group');
window.ReactDOM = require('react-dom');
const tapEventPlugin = require('react-tap-event-plugin');
tapEventPlugin();