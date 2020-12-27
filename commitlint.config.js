module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    'type-case': [0],
    'type-empty': [0], // type不为空
    'scope-empty': [0],
    'scope-case': [0],
    'subject-case': [0, 'never'],
    'header-max-length': [2, 'always', 72], // header字符最大长度为72
    'subject-full-stop': [2, 'never', '.'], // subject结尾不加.
    'type-enum': [ // commit type类型
      2,
      'always',
      [
        'feat',
        'fix',
        'polish',
        'docs',
        'style',
        'refactor',
        'revert',
        'perf',
        'test',
        'workflow',
        'ci',
        'build',
        'chore',
      ]
    ]
  }
}


