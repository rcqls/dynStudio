module.exports = function(grunt) {

  grunt.initConfig({
    nodewebkit: {
      options: {
        build_dir: './build', // Where the build version of my node-webkit app is saved
        version: '0.8.4',
        //credits: './public/credits.html',
        mac_icns: './icon.icns', // Path to the Mac icon file
        mac: true, // We want to build it for mac
        win: false, //true, // We want to build it for win
        linux32: false, //true, // We don't need linux32
        linux64: false, //true, // We don't need linux64
      },
      src: './src/**/*' // Your node-webkit app
    },
  });

  grunt.loadNpmTasks('grunt-node-webkit-builder');
  grunt.registerTask('default', ['nodewebkit']);

};