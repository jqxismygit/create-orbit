const YGenerator = require('yeoman-generator');

class Generator extends YGenerator {
  hello() {
    this.log('暂不支持创建library模块');
  }
}

module.exports = Generator;
