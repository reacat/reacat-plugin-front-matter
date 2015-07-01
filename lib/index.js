var fm = require('front-matter');
var objectAssign = require('object-assign');
var getDefaultPage = require('./getDefaultPage');

function parseFrontMatter() {
  Object.keys(this.sources).forEach(function(filePath) {
    var source = this.sources[filePath];
    var fmResult = fm(source.fileContent);
    var frontMatter = fmResult.attributes;
    // if frontMatter do not exists, then return
    if (Object.keys(frontMatter).length === 0) return;
    source.page = objectAssign(getDefaultPage.call(this, source, fmResult.body), frontMatter);
  }.bind(this));
  this.log.verbose('parseFrontMatter', this.sources);
}

module.exports = parseFrontMatter;
