module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	plugins: ['n8n-nodes-base'],
	extends: ['plugin:n8n-nodes-base/community'],
	rules: {
		'n8n-nodes-base/node-param-description-missing-final-period': 'off',
		'n8n-nodes-base/node-param-description-wrong-for-simplify': 'off',
	},
	ignorePatterns: ['.eslintrc.js', 'gulpfile.js'],
};
