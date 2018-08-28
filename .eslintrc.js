module.exports = {
    'env': {
        'browser': true,
        'commonjs': true,
        'es6': true,
    },
    'extends': 'eslint:recommended',
    'parserOptions': {
        'sourceType': 'module',
        'ecmaVersion': 2017,
    },
    'rules': {
        'semi': [
            'error',
            'always',
        ],
        'no-undef': [
            'off',
        ],
        'no-unused-vars': 'off',
        'comma-dangle': [
            'error',
            'always',
        ],
        'no-cond-assign': [
            'error',
            'always',
        ],
        'no-console': 'error',
        'no-dupe-args': 'error',
        'no-dupe-keys': 'error',
        'no-duplicate-case': 'error',
        'no-empty-character-class': 'error',
        'no-empty': 'error',
        'no-extra-boolean-cast': 'error',
        'no-extra-parens': [
            'error',
            'all',
            { 'nestedBinaryExpressions': false, },
        ],
        'no-extra-semi': 'error',
        'no-func-assign': 'error',
        'no-irregular-whitespace': 'error',
        'no-unreachable': 'error',
        'valid-typeof': 'error',
        'block-scoped-var': 'error',
        'curly': [
            'error',
            'all',
        ],
        'eqeqeq': [
            'error',
            'smart',
        ],
        'no-alert': 'error',
        'no-fallthrough': 'error',
        'no-new-func': 'error',
        'no-new': 'error',
        'no-redeclare': 'error',
        'no-self-compare': 'error',
        'no-useless-call': 'error',
        'no-catch-shadow': 'error',
        'no-undef-init': 'error',
        'brace-style': 'error',
        'comma-spacing': [
            'error',
            { 'before': false, 'after': true, },
        ],
        'indent': [
            'error',
            4,
            { 'SwitchCase': 1, },
        ],
        'key-spacing': [
            'error',
            { 'beforeColon': false, 'afterColon': true, },
        ],
        'lines-around-comment': [
            'error',
            { 'beforeBlockComment': true, 'afterBlockComment': true, 'beforeLineComment': true, 'afterLineComment': true, 'allowBlockStart': false, 'allowBlockEnd': false, },
        ],
        'new-parens': 'error',
        'no-multiple-empty-lines': [
            'error',
            { 'max': 1, },
        ],
        'no-new-object': 'error',
        'no-trailing-spaces': [
            'error',
            { 'skipBlankLines': true, },
        ],
        'object-curly-spacing': [
            'error',
            'always', { 'arraysInObjects': true, 'objectsInObjects': true, },
        ],
        'quotes': [
            'error',
            'single',
        ],
        'arrow-parens': [
            'error',
            'as-needed',
        ],
        'arrow-spacing': [
            'error',
            { 'before': true, 'after': true, },
        ],
        'no-var': 'error',
        'no-unneeded-ternary': 'error',
        'function-paren-newline': ['error', 'multiline', ],
        'space-infix-ops': 'error',
    },
};