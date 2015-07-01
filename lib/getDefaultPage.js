var path = require('path');
var fs = require('fs-extra');
var capitalize = require('capitalize');
var moment = require('moment');

var SEPARATORS_REGEXP = /[-_]/g;
var PERMALINK_REGEXP = /:([a-zA-Z0-9-_]+)/g;

var getDefaultPage = function(source, Content) {
  return {
    title: getDefaultPageTitle(source),
    date: getDefaultPageDate.call(this, source),
    // currently Content is a string, but it will be parsed to a React.Component soon.
    Content: Content,
    url: getUrl.call(this, source)
  };
};

function getDefaultPageTitle(source) {
  var title = source.filePath;
  title = path.basename(title, path.extname(title));
  title = capitalize.words(title.replace(SEPARATORS_REGEXP, ' '));
  return title;
}

function getDefaultPageDate(source) {
  var fileStat = fs.statSync(source.filePath);
  var date = moment(fileStat.birthtime).format(this.config.date_format);
  return date;
}

function getUrl(source) {
  var relative = path.relative(path.resolve(this.cwd, this.config.source_dir), source.filePath);
  var permalinkVariables = {
    path: path.join('/', path.dirname(relative), path.basename(relative, path.extname(relative)))
  };
  var url = this.config.permalink.replace(PERMALINK_REGEXP, function(arg0, key) {
    return permalinkVariables[key];
  });
  return url;
}

module.exports = getDefaultPage;
