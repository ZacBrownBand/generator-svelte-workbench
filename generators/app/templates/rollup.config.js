import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';

export default {
  plugins: [
    resolve({
      jsnext: true,
      main: true
    }),
    commonjs({
      include: /*|includes|*/[]/*|includes|*/
    }),
    svelte(),
    buble()
  ],
  output: {
    /*|format|*/format: 'amd',/*|format|*/
    /*|name|*/name: 'MyComponents',/*|name|*/
  }
};
