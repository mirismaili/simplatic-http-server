/**
 * Created at 1398/4/1 (2019/6/22).
 * @author {@link https://mirismaili.github.io S. Mahdi Mir-Ismaili}
 */
'use strict'

module.exports = {
	require: 'source-map-support/register',
	diff: true,
	extension: ['js'],
	spec: "./mocha/**/*.js",
	reporter: 'spec',
	slow: 75,
	timeout: 2000,
	ui: 'bdd'
}
