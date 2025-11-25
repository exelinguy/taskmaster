/* eslint-disable no-undef */
module.exports = {
    extends: ['gitmoji'],
    rules: {
        'subject-max-length': [2, 'always', 72], // Enforces a maximum subject length of 72 characters
        'subject-case': [2, 'always', ['lower-case', 'sentence-case']],
        'type-case': [2, 'always', ['lower-case', 'sentence-case']],
        'type-enum': [
            2,
            'always',
            [
                'feat',
                'fix',
                'docs',
                'chore',
                'style',
                'refactor',
                'test',
                'perf',
                'ci',
                'build',
                'Feat',
                'Fix',
                'Docs',
                'Chore',
                'Style',
                'Refactor',
                'Test',
                'Perf',
                'Ci',
                'Build',
            ],
        ],
    },
}
