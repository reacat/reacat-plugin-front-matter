var path = require('path');
var fs = require('fs-extra');
var fm = require('front-matter');
var capitalize = require('capitalize');
var moment = require('moment');
var objectAssign = require('object-assign');

var SEPARATORS_REGEXP = /[-_]/g;
var PERMALINK_REGEXP = /:([a-zA-Z0-9-_]+)/g;
var DEFAULT_EXECRPT_LENGTH = 140;

function parseFrontMatter() {
  Object.keys(this.sources).forEach(function(filePath) {
    var source = this.sources[filePath];
    var fmResult = fm(source.fileContent);
    var frontMatter = fmResult.attributes;
    // if frontMatter do not exists, then return
    if (Object.keys(frontMatter).length === 0) return;
    source.page = objectAssign({
      title: getDefaultPageTitle(source),
      date: getDefaultPageDate.call(this, source),
      content: fmResult.body,
      execrpt: fmResult.body.slice(DEFAULT_EXECRPT_LENGTH),
      url: getUrl.call(this, source)
    }, frontMatter);
  }.bind(this));
}

function getDefaultPageTitle(source) {
  var title = source.filePath;
  title = path.basename(title, path.extname(title));
  title = capitalize.words(title.replace(SEPARATORS_REGEXP, ' '));
  return title;
}

function getDefaultPageDate() {
  var fileStat = fs.statSync(source.filePath);
  var date = moment(fileStat.birthtime).format(this.config.date_format);
  return date;
}

function getUrl() {
  var relative = path.relative(path.resolve(this.cwd, this.config.source_dir), source.filePath);
  var permalinkVariables = {
    path: path.join('/', path.dirname(relative), path.basename(relative, path.extname(relative)))
  };
  var url = this.config.permalink.replace(PERMALINK_REGEXP, function(arg0, key) {
    return permalinkVariables[key];
  });
  return url;
}
