const { existsSync, readFileSync, writeFileSync } = require('fs');
const BasicGenerator = require('../../BasicGenerator');
const { getNameByRepository } = require('../../utils');
class Generator extends BasicGenerator {
  prompting() {
    const prompts = [
      {
        name: 'repository',
        message: '输入git仓库地址(.eg git@gitlab.sensoro.com:lins/frontend/orbit-graph.git)',
      },
      // {
      //   name: 'useCore',
      //   type: 'confirm',
      //   message: '是否需要使用 @sensoro/core ?',
      //   default: true,
      // },
      // {
      //   name: 'corePreset',
      //   type: 'confirm',
      //   message: '是否启用core的预设服务(.eg auth, socket等功能 ?',
      //   default: true,
      // },
      {
        name: 'features',
        message: '选择模块的特性?',
        type: 'checkbox',
        choices: [
          { name: 'core', value: 'core' },
          { name: 'core-preset', value: 'core-preset' },
          { name: 'sensoro-design', value: 'sensoro-design' },
        ],
        default: ['core', 'core-preset', 'sensoro-design'],
      },
      {
        name: 'dynamicModule',
        type: 'confirm',
        message: '是否启用动态模块功能(core, library, layout的动态加载) ?',
        default: true,
      },
      {
        name: 'modulePort',
        message: '输入模块端口号',
        default: 7000,
      },
    ];
    return this.prompt(prompts).then((props) => {
      console.log('check git address...');

      const { name, moduleName, packageName } = getNameByRepository(props.repository);

      let gitModules = [];
      try {
        const gitModulesContent = readFileSync(this.destinationPath('.gitmodules'), {
          encoding: 'utf-8',
        });
        gitModules =
          typeof gitModulesContent === 'string' &&
          gitModulesContent
            .split('\n')
            .filter((i) => i.startsWith('[') && i.endsWith(']'))
            .map((i) => i.split('/')[1].replace('"]', ''));
      } catch (e) {
        throw new Error('解析.gitmodules失败!');
      }
      if (
        existsSync(this.destinationPath(this.perfix, moduleName)) ||
        gitModules.indexOf(moduleName) > -1
      ) {
        throw new Error('该模块已存在');
      }

      this.prompts = {
        ...props,
        name, //模块名称
        moduleName, //模块名称(包含前缀)
        packageName, //包名
      };
    });
  }

  default() {
    console.log('clone submodule...');
    const path =
      this.perfix.length > 0
        ? `${this.perfix}/${this.prompts.moduleName}`
        : this.prompts.moduleName;
    this.spawnCommandSync('git', ['clone', this.prompts.repository, path]);
  }

  writing() {
    this.writeFiles({
      context: this.prompts,
    });
  }

  end() {
    console.log('link submodule...');

    this.spawnCommandSync('git', ['add', '.'], {
      cwd: this.destinationPath(this.perfix, this.prompts.moduleName),
    });

    this.spawnCommandSync('git', ['commit', '-am', '"feat: init"'], {
      cwd: this.destinationPath(this.perfix, this.prompts.moduleName),
    });

    this.spawnCommandSync('git', ['checkout', '-b', 'dev1'], {
      cwd: this.destinationPath(this.perfix, this.prompts.moduleName),
    });

    try {
      const gitModulesPath = this.destinationPath('.gitmodules');
      let gitModulesContent = readFileSync(gitModulesPath, {
        encoding: 'utf-8',
      });
      const path =
        this.perfix.length > 0
          ? `${this.perfix}/${this.prompts.moduleName}`
          : this.prompts.moduleName;
      gitModulesContent += `
[submodule "${path}"]
  path = ${path}
  url = ${this.prompts.repository}
      `;
      writeFileSync(gitModulesPath, gitModulesContent, 'utf-8');
    } catch (e) {
      throw new Error('add submodule失败!');
    }

    this.spawnCommandSync('git', ['push', 'origin', 'dev1'], {
      cwd: this.destinationPath(this.perfix, this.prompts.moduleName),
    });

    //提交容器代码
    this.spawnCommandSync('git', ['add', '.']);

    this.spawnCommandSync('git', [
      'commit',
      '-am',
      `"feat: add submodule ${this.prompts.moduleName}"`,
    ]);

    this.spawnCommandSync('git', ['push', 'origin', this.branch]);
  }
}

module.exports = Generator;
