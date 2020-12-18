const Generator = require('yeoman-generator');
const glob = require('glob');
const { statSync } = require('fs');
const { join } = require('path');
const debug = require('debug')('create-orbit:BasicGenerator');

function noop() {
  return true;
}

class BasicGenerator extends Generator {
  constructor(opts) {
    super(opts);
    this.opts = opts;
  }

  writeFiles({ context, filterFiles = noop }) {
    debug(`context: ${JSON.stringify(context)}`);

    glob
      .sync('**/*', {
        cwd: this.templatePath(),
        dot: true,
      })
      .filter(filterFiles)
      .forEach((file) => {
        debug(`copy ${file}`);
        const filePath = this.templatePath(file);
        if (statSync(filePath).isFile() && file !== '.DS_Store') {
          this.fs.copyTpl(
            this.templatePath(filePath),
            join(this.destinationPath(context.moduleName, file.replace(/^_/, '.'))),
            context,
          );
        }
      });
  }

  prompt(questions) {
    process.send && process.send({ type: 'prompt' });
    process.emit('message', { type: 'prompt' });
    return super.prompt(questions);
  }
}

module.exports = BasicGenerator;
