//react entry

window.React = require('react');
window.React.addons = React.addons || {};
window.React.addons.TransitionGroup = require('react-addons-transition-group');
window.ReactDOM = require('react-dom');
const tapEventPlugin = require('react-tap-event-plugin');
tapEventPlugin();
console.log('custom react built');