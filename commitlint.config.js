export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation
        'style', // Formatting (no code change)
        'refactor', // Refactoring
        'perf', // Performance
        'test', // Tests
        'build', // Build system
        'ci', // CI
        'chore', // Chores
        'revert', // Revert
      ],
    ],
    'scope-enum': [
      1,
      'always',
      [
        'api',
        'web',
        'seller',
        'admin',
        'auth',
        'products',
        'orders',
        'payments',
        'inventory',
        'search',
        'notifications',
        'analytics',
        'config',
        'ui',
        'database',
        'docker',
        'ci',
        'deps',
      ],
    ],
    'subject-case': [2, 'never', ['start-case', 'pascal-case', 'upper-case']],
  },
}
