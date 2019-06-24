import snakeCase from 'lodash.snakecase'
import camelCase from 'lodash.camelcase'
import os from "os"
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import {terser} from 'rollup-plugin-terser'
import typescript from 'rollup-plugin-typescript2'
import builtins from 'builtin-modules/static'

const pkg = require('./package.json')

const libraryName = pkg.name.slice(pkg.name.indexOf('/') + 1)
const libVarName = snakeCase(libraryName) + '_lib'

const isProd = process.env.BUILD === 'production'
const uglify = process.env.UGLIFY

// https://stackoverflow.com/a/56114625/5318303

const externals = [...builtins, ...Object.keys(pkg.dependencies || {})]

const globals = {}
externals.map(key => globals[key] = /[-.]/.test(key) ? camelCase(key) : key)

// noinspection JSUnusedGlobalSymbols
export default {
	input: `src/main.ts`,
	output: {format: 'umd', file: pkg.main, name: libVarName, sourcemap: true, globals: globals},
	watch: {include: 'src/**'},

	external: externals,
	
	plugins: [
		commonjs(),
		typescript({
			useTsconfigDeclarationDir: true,
			cacheRoot: `${os.tmpdir()}/.rpt2_cache`, // See: https://github.com/ezolenko/rollup-plugin-typescript2/issues/34#issuecomment-332591290
		}),
		(uglify === 'true' || uglify !== 'false' && isProd) && terser(),
		sourceMaps(),
		// nodeBuiltins(),  // Doesn't work when `external` has been set (or when auto-external has been used)!
	],
}
